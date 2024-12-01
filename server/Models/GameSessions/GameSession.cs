using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using RuleChaos.Models.Messages;
using RuleChaos.Models.Players;

namespace RuleChaos.Models.GameSessions
{
  public class GameSession(bool isPrivate)
  {
    public Guid Id { get; } = Guid.NewGuid();
    public bool IsPrivate { get; } = isPrivate;

    public bool HasEnoughPlayers { get => this.players.Count == GameSession.PlayersNumber; }

    public PlayerDTO[] PlayersDTOs { get => [.. this.players.ConvertAll((player) => player.ToDTO())]; }

    private static readonly byte PlayersNumber = 2;

    private readonly List<Player> players = [];

    private DateTime lastActivity = DateTime.UtcNow;

    private Player? activePlayer;

    public GameSessionDTO ToDTO()
    {
      return new GameSessionDTO(this);
    }

    public Task HandlePlayer(Player player)
    {
      this.AddPlayer(player);

      if (this.HasEnoughPlayers)
      {
        this.StartSession();
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
        this.SendMessageToPlayers(new MessagePlayerLeftSession(player.ToDTO(), this.PlayersDTOs));
      });
    }

    public void MakeFirstOrNextPlayerActive()
    {
      try
      {
        if (this.activePlayer == null)
        {
          this.activePlayer = this.players[0];
          this.SendMessageToPlayers(new MessageNewActivePlayer(this.activePlayer.ToDTO()));

          return;
        }

        var index = this.players.IndexOf(this.activePlayer);

        if (index == -1)
        {
          throw new Exception($"Не найден игрок с  id {this.activePlayer.Id}");
        }

        this.activePlayer = this.players[(index + 1) % this.players.Count];

        this.SendMessageToPlayers(new MessageNewActivePlayer(this.activePlayer.ToDTO()));
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

    private void StartSession()
    {
      this.SendMessageToPlayers(new MessageSessionWasStarted());

      this.MakeFirstOrNextPlayerActive();
    }

    private void SendMessageToPlayers(Message message)
    {
      this.players.ForEach((player) => player.SendMessage(message));
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
        this.SendMessageToPlayers(new MessagePlayerJoinedSession(player.ToDTO(), this.PlayersDTOs));

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
}
