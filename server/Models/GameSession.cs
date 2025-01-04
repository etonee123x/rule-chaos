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
    public GameSession(bool isPrivate, TimeSpan? turnDuration)
    {
      this.IsPrivate = isPrivate;
      this.TurnDuration = turnDuration;

      Task.Run(async () =>
      {
        this.ItemGenerator = await ItemGenerator.CreateInstanse();
      });
    }

    public Guid Id { get; } = Guid.NewGuid();
    public bool IsPrivate { get; }
    public TimeSpan? TurnDuration { get; init; }

    public bool HasEnoughPlayers { get => this.Players.Count == GameSession.PlayersNumber; }

    internal Player? ActivePlayer { get; private set; }
    internal AbsoluteTimerLimits? ActivePlayerAbsoluteTimerLimits { get; private set; }

    private static readonly byte PlayersNumber = 4;
    private static readonly byte ItemsPerPlayer = 8;
    private static readonly byte HistoryRecordsCount = 50;

    public List<Player> Players { get; } = [];
    public List<Player> PlayersInRound
    {
      get => this.Players.Where(player => player.IsInRound).ToList();
    }

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
        this.SendMessageToPlayers(new MessagePlayerLeftSession(player, this.Players));
      });
    }

    public void MakeFirstOrNextPlayerActive()
    {
      void MakePlayerActiveAndSendMessage(Player player)
      {
        this.ActivePlayer = player;

        if (this.TurnDuration is not null)
        {
          this.ActivePlayerAbsoluteTimerLimits = new AbsoluteTimerLimits(this.TurnDuration.Value);
        }

        this.SendMessageToPlayers(new MessageNewActivePlayer(this.ActivePlayer, this.ActivePlayerAbsoluteTimerLimits));
      }

      try
      {
        if (this.ActivePlayer is null)
        {
          MakePlayerActiveAndSendMessage(this.PlayersInRound[0]);
          return;
        }

        var index = this.PlayersInRound.IndexOf(this.ActivePlayer);

        if (index == -1)
        {
          throw new Exception($"Не найден игрок с  id {this.ActivePlayer.Id}");
        }

        MakePlayerActiveAndSendMessage(this.PlayersInRound[(index + 1) % this.PlayersInRound.Count]);
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
      this.Players.ForEach((player) => player.SendMessage(message));

      var maybeHistoryRecord = message.HistoryRecord;

      if (maybeHistoryRecord is null)
      {
        return;
      }

      this.History = [.. this.History, maybeHistoryRecord];
    }

    public void StartRound(List<Guid> playersIds)
    {
      playersIds.ForEach(playerId =>
      {
        var maybePlayer = this.Players.Find(player => player.Id.Equals(playerId));

        if (maybePlayer is null)
        {
          return;
        }

        maybePlayer.IsInRound = true;
      });

      this.IsRoundActive = true;
      this.SendMessageToPlayers(new MessageRoundWasStarted(this.PlayersInRound));

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
    public PlayerDTO[] Players { get; } = gameSession.Players.Select((player) => player.ToDTO()).ToArray();

    [JsonPropertyName("turnDuration")]
    public TimeSpan? TurnDuration { get; } = gameSession.TurnDuration;
  }

  public class GameSessionDTO(GameSession gameSession)
  {
    [JsonPropertyName("players")]
    public PlayerDTO[] Players { get; } = gameSession.Players.Select((player) => player.ToDTO()).ToArray();

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

    [JsonPropertyName("activePlayerAbsoluteTimerLimits")]
    public AbsoluteTimerLimitsDTO? ActivePlayerAbsoluteTimerLimits { get; } = gameSession.ActivePlayerAbsoluteTimerLimits?.ToDTO();
  }
}
