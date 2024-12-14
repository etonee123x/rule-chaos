using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using RuleChaos.Models.Item;
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

    private static readonly byte PlayersNumber = 2;
    private static readonly byte ItemsPerPlayer = 8;
    private static readonly byte HistoryRecordsCount = 20;

    private readonly List<Player> players = [];

    private DateTime lastActivity = DateTime.UtcNow;

    private Player? activePlayer;

    private ItemGenerator? ItemGenerator { get; set; }

    private Item.Item[] items = [];

    private Item.Item[] Items
    {
      set
      {
        this.SendMessageToPlayers(new MessageItemsUpdate(this.items.Select((item) => item.ToDTO()).ToArray(), value.Select((item) => item.ToDTO()).ToArray()));
        this.items = value;
      }
    }

    private string[] history = [];

    private string[] History
    {
      get => this.history;
      set
      {
        var historyLast = value.Length >= GameSession.HistoryRecordsCount ? value[^GameSession.HistoryRecordsCount..] : value;

        this.SendMessageToPlayers(new MessageHistory(historyLast));
        this.history = historyLast;
      }
    }

    private bool IsRoundActive { get => this.activePlayer != null; }

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
        this.SendMessageToPlayers(new MessagePlayerLeftSession(player, this.players));
      });
    }

    public void MakeFirstOrNextPlayerActive()
    {
      try
      {
        if (this.activePlayer == null)
        {
          this.activePlayer = this.players[0];
          this.SendMessageToPlayers(new MessageNewActivePlayer(this.activePlayer));

          return;
        }

        var index = this.players.IndexOf(this.activePlayer);

        if (index == -1)
        {
          throw new Exception($"Не найден игрок с  id {this.activePlayer.Id}");
        }

        this.activePlayer = this.players[(index + 1) % this.players.Count];

        this.SendMessageToPlayers(new MessageNewActivePlayer(this.activePlayer));
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

      this.Items = new Item.Item[this.players.Count * GameSession.ItemsPerPlayer].Select((item) => this.ItemGenerator.Next()).ToArray();
      this.MakeFirstOrNextPlayerActive();
    }

    private void SendMessageToPlayers(MessageFromServer message)
    {
      this.players.ForEach((player) => player.SendMessage(message));

      if (message.GetType().Equals(typeof(MessageHistory)))
      {
        return;
      }

      this.History = [.. this.History, message.HistoryRecord];
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
      if (player.Equals(this.activePlayer))
      {
        this.activePlayer = null;
      }

      this.players.Remove(player);

      this.Log($"Игрок {player} отключился");
    }

    private void Log(params object[] args)
    {
      Console.WriteLine(string.Join(' ', args));
    }
  }

  public class GameSessionDTO(GameSession gameSession)
  {
    [JsonPropertyName("id")]
    public Guid Id { get; } = gameSession.Id;

    [JsonPropertyName("players")]
    public PlayerDTO[] Players { get; } = gameSession.PlayersDTOs;
  }
}
