using System.Net.WebSockets;
using System.Text;
using RuleChaos.Models.Messages;

namespace RuleChaos.Models
{
  public class GameSession
  {
    public bool HasEnoughPlayers { get => this.Players.Count == GameSession.PlayersNumber; }

    private static readonly byte PlayersNumber = 2;

    private string Id { get; }

    private List<Player> Players { get; set; } = [];

    private Player? ActivePlayer { get; set; }

    private string[] PlayersNames { get => [.. this.Players.ConvertAll((player) => player.Name)]; }

    public GameSession(string id)
    {
      this.Id = id;
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

          var message = Encoding.UTF8.GetString(buffer, 0, result.Count);

          if (result.MessageType == WebSocketMessageType.Close)
          {
            await player.WebSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
            break;
          }

          this.HandlePlayerMessage(player, message);
        }

        this.RemovePlayer(player);
        this.SendMessageToPlayers(new MessagePlayerLeftSession(player.Name, this.PlayersNames));
      });
    }

    private void StartSession()
    {
      this.SendMessageToPlayers(new MessageSessionWasStarted());

      this.MakeFirstOrNextPlayerActive();
    }

    private void MakeFirstOrNextPlayerActive()
    {
      try
      {
        if (this.ActivePlayer == null)
        {
          this.ActivePlayer = this.Players[0];
          this.SendMessageToPlayers(new MessageNewActivePlayer(this.ActivePlayer.Name));

          return;
        }

        var index = this.Players.IndexOf(this.ActivePlayer);

        if (index == -1)
        {
          throw new Exception($"Не найден игрок с  id {this.ActivePlayer.Id}");
        }

        this.ActivePlayer = this.Players[(index + 1) % this.Players.Count];

        this.SendMessageToPlayers(new MessageNewActivePlayer(this.ActivePlayer.Name));
      }
      catch (Exception exception)
      {
        this.Log(exception);
      }
    }

    private void SendMessageToPlayers(Message message)
    {
      this.Players.ForEach((player) => player.SendMessage(message));
    }

    private void HandlePlayerMessage(Player player, string message)
    {
      Console.WriteLine(message);
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
        this.SendMessageToPlayers(new MessagePlayerJoinedSession(player.Name, this.PlayersNames));

        this.Log($"Игрок {player} подключился");
      }
      catch (Exception exception)
      {
        this.Log(exception);
      }
    }

    private void RemovePlayer(Player player)
    {
      this.Players.Remove(player);

      this.Log($"Игрок {player} отключился");
    }

    private void Log(params object[] args)
    {
      Console.WriteLine($"{this.Id}: {string.Join(' ', args)}");
    }
  }
}
