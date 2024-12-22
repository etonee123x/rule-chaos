using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using RuleChaos.Models.Messages;

namespace RuleChaos.Models
{
  public class GameSession
  {
    public GameSession(bool isPrivate)
    {
      this.IsPrivate = isPrivate;

      Task.Run(async () =>
      {
        this.ItemGenerator = await ItemGenerator.CreateInstanse();
      });
    }

    public Guid Id { get; } = Guid.NewGuid();
    public bool IsPrivate { get; }

    public bool HasEnoughPlayers { get => this.Players.Count == GameSession.PlayersNumber; }

    public PlayerDTO[] PlayersDTOs { get => this.Players.ConvertAll((player) => player.ToDTO()).ToArray(); }

    internal Player? ActivePlayer { get; set; }

    private static readonly byte PlayersNumber = 2;
    private static readonly byte ItemsPerPlayer = 8;
    private static readonly byte HistoryRecordsCount = 50;

    public List<Player> Players { get; } = [];
    public List<ItemWithPosition> ItemsOnField { get; } = [];
    public List<Item> ItemsInHand { get; private set; } = [];

    private DateTime lastActivity = DateTime.UtcNow;

    private ItemGenerator? ItemGenerator { get; set; }

    private HistoryRecord[] history = [];

    internal HistoryRecord[] History
    {
      get => this.history;
      set
      {
        var historyLast = value.Length >= GameSession.HistoryRecordsCount ? value[^GameSession.HistoryRecordsCount..] : value;

        this.SendMessageToPlayers(new MessageHistory(historyLast));
        this.history = historyLast;
      }
    }

    private bool IsRoundActive { get => this.ActivePlayer is not null; }

    public GameSessionListingDTO ToListingDTO()
    {
      return new GameSessionListingDTO(this);
    }

    public GameSessionDTO ToDTO()
    {
      return new GameSessionDTO(this);
    }

    public Task HandlePlayer(Player player)
    {
      this.AddPlayer(player);

      if (this.HasEnoughPlayers)
      {
        this.StartRound();
      }

      return Task.Run(async () =>
      {
        var buffer = new byte[1024 * 4];

        while (player.WebSocket.State == WebSocketState.Open)
        {
          var result = await player.WebSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

          var serializedMessage = Encoding.UTF8.GetString(buffer, 0, result.Count);

          if (result.MessageType == WebSocketMessageType.Close)
          {
            await player.WebSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
            break;
          }

          this.UpdateActivity();

          this.HandlePlayerMessage(player, serializedMessage);
        }

        this.RemovePlayer(player);
        this.SendMessageToPlayers(new MessagePlayerLeftSession(player, this.Players));
      });
    }

    public void MakeFirstOrNextPlayerActive()
    {
      try
      {
        if (this.ActivePlayer is null)
        {
          this.ActivePlayer = this.Players[0];
          this.SendMessageToPlayers(new MessageNewActivePlayer(this.ActivePlayer));

          return;
        }

        var index = this.Players.IndexOf(this.ActivePlayer);

        if (index == -1)
        {
          throw new Exception($"Не найден игрок с  id {this.ActivePlayer.Id}");
        }

        this.ActivePlayer = this.Players[(index + 1) % this.Players.Count];

        this.SendMessageToPlayers(new MessageNewActivePlayer(this.ActivePlayer));
      }
      catch (Exception exception)
      {
        this.Log(exception);
      }
    }

    public void PlaceItem(Player player, ItemWithPosition itemWithPosition)
    {
      if (!this.IsThisPlayerActive(player))
      {
        // Ходит не в свой ход
        Console.WriteLine("Ходит не в свой ход");
        return;
      }

      if (this.IsPositionOccupied(itemWithPosition.Position))
      {
        // На этой позиции уже что то есть
        Console.WriteLine("На этой позиции уже что то есть");
        return;
      }

      var itemInHand = this.FindItemInHand(itemWithPosition);

      if (itemInHand is null)
      {
        // Нет такого предмета
        Console.WriteLine("Нет такого предмета");
        return;
      }

      this.ItemsOnField.Add(itemWithPosition);
      this.SendMessageToPlayers(new MessageItemsOnFieldUpdate(this.ItemsOnField));

      this.ItemsInHand.Remove(itemInHand);
      this.SendMessageToPlayers(new MessageItemsInHandUpdate(this.ItemsInHand));

      this.MakeFirstOrNextPlayerActive();
    }

    public void UpdateActivity()
    {
      this.lastActivity = DateTime.UtcNow;
    }

    public bool IsInactive(TimeSpan timeSpan)
    {
      return DateTime.UtcNow - this.lastActivity > timeSpan;
    }

    private void StartRound()
    {
      this.SendMessageToPlayers(new MessageRoundWasStarted());

      if (this.ItemGenerator is null)
      {
        throw new Exception("Has no item generator");
      }

      this.ItemsInHand = new Item[this.Players.Count * GameSession.ItemsPerPlayer].Select((item) => this.ItemGenerator.Next()).ToList();
      this.ItemsInHand.ForEach((itemInHand) => Console.WriteLine(itemInHand.Id));
      this.SendMessageToPlayers(new MessageItemsInHandUpdate(this.ItemsInHand));

      this.MakeFirstOrNextPlayerActive();
    }

    private void SendMessageToPlayers(MessageFromServer message)
    {
      this.Players.ForEach((player) => player.SendMessage(message));

      var maybeHistoryRecord = message.HistoryRecord;

      if (maybeHistoryRecord is null)
      {
        return;
      }

      this.History = [.. this.History, maybeHistoryRecord];
    }

    private void HandlePlayerMessage(Player player, string serializedMessage)
    {
      var type = JsonDocument.Parse(serializedMessage).RootElement.GetProperty("type").GetString();

      if (type is null || !MessageFromClient.MessageTypeToMessage.TryGetValue(type, out var messageType))
      {
        return;
      }

      Console.WriteLine(serializedMessage);
      ((MessageFromClient?)JsonSerializer.Deserialize(serializedMessage, messageType))?.Handle(this, player);
    }

    private void AddPlayer(Player player)
    {
      try
      {
        if (this.Players.Count >= GameSession.PlayersNumber)
        {
          throw new Exception($"{this.Players.Count} игроков из ${GameSession.PlayersNumber}");
        }

        this.Players.Add(player);
        this.SendMessageToPlayers(new MessagePlayerJoinedSession(player, this.Players));

        this.Log($"Игрок {player} подключился");
      }
      catch (Exception exception)
      {
        this.Log(exception);
      }
    }

    private void RemovePlayer(Player player)
    {
      if (player.Equals(this.ActivePlayer))
      {
        this.ActivePlayer = null;
      }

      this.Players.Remove(player);

      this.Log($"Игрок {player} отключился");
    }

    private bool IsThisPlayerActive(Player player)
    {
      return player == this.ActivePlayer;
    }

    private bool IsPositionOccupied(Position position)
    {
      return this.ItemsOnField.Any((itemOnField) => itemOnField.Position.Equals(position));
    }

    private Item? FindItemInHand(Item item)
    {
      Console.WriteLine($"Ищем ID {item.Id}");
      return this.ItemsInHand.Find((itemInHand) =>
      {
        Console.WriteLine(itemInHand.Id);
        return itemInHand.Equals(item);
      });
    }

    private void Log(params object[] args)
    {
      Console.WriteLine(string.Join(' ', args));
    }
  }

  public class GameSessionListingDTO(GameSession gameSession)
  {
    [JsonPropertyName("id")]
    public Guid Id { get; } = gameSession.Id;

    [JsonPropertyName("players")]
    public PlayerDTO[] Players { get; } = gameSession.PlayersDTOs;
  }

  public class GameSessionDTO(GameSession gameSession)
  {
    [JsonPropertyName("players")]
    public PlayerDTO[] Players { get; } = gameSession.PlayersDTOs;

    [JsonPropertyName("activePlayer")]
    public PlayerDTO? ActivePlayer { get; } = gameSession.ActivePlayer?.ToDTO();

    [JsonPropertyName("itemsInHand")]
    public ItemDTO[] ItemsInHand { get; } = gameSession.ItemsInHand.Select((itemInHand) => itemInHand.ToDTO()).ToArray();

    [JsonPropertyName("itemsOnField")]
    public ItemWithPositionDTO[] ItemsOnField { get; } = gameSession.ItemsOnField.Select((itemOnField) => itemOnField.ToDTO()).ToArray();

    [JsonPropertyName("history")]
    public HistoryRecordDTO[] History { get; } = gameSession.History.Select((historyRecord) => historyRecord.ToDTO()).ToArray();
  }
}
