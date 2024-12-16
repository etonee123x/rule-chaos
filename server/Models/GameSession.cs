using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
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

    public bool HasEnoughPlayers { get => this.players.Count == GameSession.PlayersNumber; }

    public PlayerDTO[] PlayersDTOs { get => [.. this.players.ConvertAll((player) => player.ToDTO())]; }

    internal Player? ActivePlayer { get; set; }

    private static readonly byte PlayersNumber = 2;
    private static readonly byte ItemsPerPlayer = 8;
    private static readonly byte HistoryRecordsCount = 50;

    private readonly List<Player> players = [];

    private DateTime lastActivity = DateTime.UtcNow;

    private ItemGenerator? ItemGenerator { get; set; }

    private Item[] itemsInHand = [];

    internal Item[] ItemsInHand
    {
      get => this.itemsInHand;
      set
      {
        this.SendMessageToPlayers(new MessageItemsUpdate(this.itemsInHand.Select((item) => item.ToDTO()).ToArray(), value.Select((item) => item.ToDTO()).ToArray()));
        this.itemsInHand = value;
      }
    }

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

    private bool IsRoundActive { get => this.ActivePlayer != null; }

    public GameSessionListingDTO ToDTO()
    {
      return new GameSessionListingDTO(this);
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
        this.SendMessageToPlayers(new MessagePlayerLeftSession(player, this.players));
      });
    }

    public void MakeFirstOrNextPlayerActive()
    {
      try
      {
        if (this.ActivePlayer == null)
        {
          this.ActivePlayer = this.players[0];
          this.SendMessageToPlayers(new MessageNewActivePlayer(this.ActivePlayer));

          return;
        }

        var index = this.players.IndexOf(this.ActivePlayer);

        if (index == -1)
        {
          throw new Exception($"Не найден игрок с  id {this.ActivePlayer.Id}");
        }

        this.ActivePlayer = this.players[(index + 1) % this.players.Count];

        this.SendMessageToPlayers(new MessageNewActivePlayer(this.ActivePlayer));
      }
      catch (Exception exception)
      {
        this.Log(exception);
      }
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

      if (this.ItemGenerator == null)
      {
        throw new Exception("Has no item generator");
      }

      this.ItemsInHand = new Item[this.players.Count * GameSession.ItemsPerPlayer].Select((item) => this.ItemGenerator.Next()).ToArray();
      this.MakeFirstOrNextPlayerActive();
    }

    private void SendMessageToPlayers(MessageFromServer message)
    {
      this.players.ForEach((player) => player.SendMessage(message));

      var maybeHistoryRecord = message.HistoryRecord;

      if (maybeHistoryRecord == null)
      {
        return;
      }

      this.History = [.. this.History, maybeHistoryRecord];
    }

    private void HandlePlayerMessage(Player player, string serializedMessage)
    {
      var type = JsonDocument.Parse(serializedMessage).RootElement.GetProperty("type").GetString();

      if (type == null || !MessageFromClient.MessageTypeToMessage.TryGetValue(type, out var messageType))
      {
        return;
      }

      ((MessageFromClient?)JsonSerializer.Deserialize(serializedMessage, messageType))?.Handle(this, player);
    }

    private void AddPlayer(Player player)
    {
      try
      {
        if (this.players.Count >= GameSession.PlayersNumber)
        {
          throw new Exception($"{this.players.Count} игроков из ${GameSession.PlayersNumber}");
        }

        this.players.Add(player);
        this.SendMessageToPlayers(new MessagePlayerJoinedSession(player, this.players));

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

      this.players.Remove(player);

      this.Log($"Игрок {player} отключился");
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
    public Player? ActivePlayer { get; } = gameSession.ActivePlayer;

    [JsonPropertyName("itemsInHand")]
    public Item[] ItemsInHand { get; } = gameSession.ItemsInHand;

    [JsonPropertyName("history")]
    public HistoryRecord[] History { get; } = gameSession.History;
  }
}
