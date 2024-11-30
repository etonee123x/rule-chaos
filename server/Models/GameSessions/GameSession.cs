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

    public bool HasEnoughPlayers { get => this.Players.Count == GameSession.PlayersNumber; }

    public PlayerDTO[] PlayersDTOs { get => [.. this.Players.ConvertAll((player) => player.ToDTO())]; }

    private static readonly byte PlayersNumber = 2;

    private List<Player> Players { get; set; } = [];

    private Player? ActivePlayer { get; set; }

    public GameSessionDTO ToDTO()
    {
      return new GameSessionDTO(this);
    }

    public void HandlePlayer(Player player)
    {
      this.AddPlayer(player);

      if (this.HasEnoughPlayers)
      {
        this.StartSession();
      }

      Task.Run(async () =>
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
        if (this.ActivePlayer == null)
        {
          this.ActivePlayer = this.Players[0];
          this.SendMessageToPlayers(new MessageNewActivePlayer(this.ActivePlayer.ToDTO()));

          return;
        }

        var index = this.Players.IndexOf(this.ActivePlayer);

        if (index == -1)
        {
          throw new Exception($"Не найден игрок с  id {this.ActivePlayer.Id}");
        }

        this.ActivePlayer = this.Players[(index + 1) % this.Players.Count];

        this.SendMessageToPlayers(new MessageNewActivePlayer(this.ActivePlayer.ToDTO()));
      }
      catch (Exception exception)
      {
        this.Log(exception);
      }
    }

    private void StartSession()
    {
      this.SendMessageToPlayers(new MessageSessionWasStarted());

      this.MakeFirstOrNextPlayerActive();
    }

    private void SendMessageToPlayers(Message message)
    {
      this.Players.ForEach((player) => player.SendMessage(message));
    }

    private void HandlePlayerMessage(Player player, string serializedMessage)
    {
      var type = JsonDocument.Parse(serializedMessage).RootElement.GetProperty("Type").GetString();

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
        if (this.Players.Count >= GameSession.PlayersNumber)
        {
          throw new Exception($"{this.Players.Count} игроков из ${GameSession.PlayersNumber}");
        }

        this.Players.Add(player);
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
      if (player.Equals(this.ActivePlayer))
      {
        this.ActivePlayer = null;
      }

      this.Players.Remove(player);

      this.Log($"Игрок {player} отключился");
    }

    private void Log(params object[] args)
    {
      Console.WriteLine(string.Join(' ', args));
    }
  }
}
