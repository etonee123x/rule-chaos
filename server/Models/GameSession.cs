using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using RuleChaos.Models.Messages;
using RuleChaos.Models.Votings;

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

    public bool HasEnoughPlayers { get => this.PlayersInSession.Count == GameSession.PlayersNumber; }

    public PlayerDTO[] PlayersDTOs { get => this.PlayersInSession.ConvertAll((player) => player.ToDTO()).ToArray(); }

    internal Player? ActivePlayer { get; set; }

    private static readonly byte PlayersNumber = 2;
    private static readonly byte ItemsPerPlayer = 8;
    private static readonly byte HistoryRecordsCount = 50;

    public List<Player> PlayersInSession { get; } = [];
    public List<Player> PlayersInRound { get; private set; } = [];

    public List<ItemWithPosition> ItemsOnField { get; } = [];
    public List<Item> ItemsInHand { get; private set; } = [];

    public bool IsRoundActive { get; set; }

    public Voting? ActiveVoting { get; set; }

    private DateTime lastActivity = DateTime.UtcNow;

    private ItemGenerator? ItemGenerator { get; set; }

    private HistoryRecord[] history = [];

    internal HistoryRecord[] History
    {
      get => this.history;
      set
      {
        var historyLast = value.Length >= GameSession.HistoryRecordsCount ? value[^GameSession.HistoryRecordsCount..] : value;

        this.SendMessageToPlayers(new MessageHistoryUpdate(historyLast));
        this.history = historyLast;
      }
    }

    public GameSessionListingDTO ToListingDTO() => new GameSessionListingDTO(this);

    public GameSessionDTO ToDTO() => new GameSessionDTO(this);

    public Task HandlePlayer(Player player)
    {
      this.AddPlayer(player);

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
        this.SendMessageToPlayers(new MessagePlayerLeftSession(player, this.PlayersInSession));
      });
    }

    public void MakeFirstOrNextPlayerActive()
    {
      try
      {
        if (this.ActivePlayer is null)
        {
          this.ActivePlayer = this.PlayersInRound[0];
          this.SendMessageToPlayers(new MessageNewActivePlayer(this.ActivePlayer));

          return;
        }

        var index = this.PlayersInRound.IndexOf(this.ActivePlayer);

        if (index == -1)
        {
          throw new Exception($"Не найден игрок с  id {this.ActivePlayer.Id}");
        }

        this.ActivePlayer = this.PlayersInRound[(index + 1) % this.PlayersInRound.Count];

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
        return;
      }

      if (this.IsPositionOccupied(itemWithPosition.Position))
      {
        // На этой позиции уже что то есть
        return;
      }

      var itemInHand = this.FindItemInHand(itemWithPosition);

      if (itemInHand is null)
      {
        // Нет такого предмета
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

    public bool IsInactive(TimeSpan timeSpan) => DateTime.UtcNow - this.lastActivity > timeSpan;

    public void SendMessageToPlayers(MessageFromServer message)
    {
      this.PlayersInSession.ForEach((player) => player.SendMessage(message));

      var maybeHistoryRecord = message.HistoryRecord;

      if (maybeHistoryRecord is null)
      {
        return;
      }

      this.History = [.. this.History, maybeHistoryRecord];
    }

    public void StartRound(List<Guid> playersIds)
    {
      this.PlayersInRound = this.PlayersInSession.Where((playerInSession) => playersIds.Contains(playerInSession.Id)).ToList();

      this.SendMessageToPlayers(new MessageRoundWasStarted());

      if (this.ItemGenerator is null)
      {
        throw new Exception("Has no item generator");
      }

      this.ItemsInHand = new Item[this.PlayersInRound.Count * GameSession.ItemsPerPlayer].Select((item) => this.ItemGenerator.Next()).ToList();
      this.SendMessageToPlayers(new MessageItemsInHandUpdate(this.ItemsInHand));

      this.MakeFirstOrNextPlayerActive();
    }

    private void HandlePlayerMessage(Player player, string serializedMessage)
    {
      var type = JsonDocument.Parse(serializedMessage).RootElement.GetProperty("type").GetString();

      if (type is null || !MessageFromClient.MessageTypeToMessage.TryGetValue(type, out var messageType))
      {
        return;
      }

      ((MessageFromClient?)JsonSerializer.Deserialize(serializedMessage, messageType))?.Handle(this, player);
    }

    private void AddPlayer(Player player)
    {
      try
      {
        if (this.PlayersInSession.Count >= GameSession.PlayersNumber)
        {
          throw new Exception($"{this.PlayersInSession.Count} игроков из ${GameSession.PlayersNumber}");
        }

        this.PlayersInSession.Add(player);
        this.SendMessageToPlayers(new MessagePlayerJoinedSession(player, this.PlayersInSession));

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

      this.PlayersInSession.Remove(player);

      this.Log($"Игрок {player} отключился");
    }

    private bool IsThisPlayerActive(Player player) => player == this.ActivePlayer;

    private bool IsPositionOccupied(Position position) => this.ItemsOnField.Any((itemOnField) => itemOnField.Position.Equals(position));

    private Item? FindItemInHand(Item item) => this.ItemsInHand.Find((itemInHand) => itemInHand.Equals(item));

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

    [JsonPropertyName("isRoundActive")]
    public bool IsRoundActive { get; } = gameSession.IsRoundActive;

    [JsonPropertyName("activeVoting")]
    public VotingDTO? ActiveVoting { get; } = gameSession.ActiveVoting?.ToDTO();
  }
}
