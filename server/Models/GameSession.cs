using System.Net.WebSockets;
using System.Reflection.Metadata;
using System.Text;
using System.Text.Json;

namespace RuleChaos.Models
{
  public class GameSession
  {
    private interface IMessageParams
    {
    }

    private class Message<T>
      where T : IMessageParams
    {
      public enum MessageType
      {
        Move,
      }

      public MessageType Type { get; set; }
      public T Params { get; set; }
    }

    private static byte playersNumber = 2;

    private string Id { get; }

    private List<Player> Players { get; set; } = [];

    private Player? ActivePlayer { get; set; }

    public GameSession(string id)
    {
      this.Id = id;
    }

    public bool IsReady
    {
      get => this.Players.Count == GameSession.playersNumber;
    }

    public void AddPlayer(Player player)
    {
      try
      {
        if (this.Players.Count >= GameSession.playersNumber)
        {
          throw new Exception($"{this.Players.Count} игроков из ${GameSession.playersNumber}");
        }

        this.Players.Add(player);
        this.Log($"Игрок {player.Id} подключился");
      }
      catch (Exception exception)
      {
        this.Log(exception);
      }
    }

    public void MakeFirstOrNextPlayerActive()
    {
      try
      {
        if (this.ActivePlayer == null)
        {
          this.ActivePlayer = this.Players[0];
          return;
        }

        var index = this.Players.IndexOf(this.ActivePlayer);

        if (index == -1)
        {
          throw new Exception($"Не найден игрок с  id {this.ActivePlayer.Id}");
        }

        this.ActivePlayer = this.Players[(index + 1) % this.Players.Count];
      }
      catch (Exception exception)
      {
        this.Log(exception);
      }
    }

    public void HandlePlayerMessage(Player player, string message)
    {
      Console.WriteLine(message);
      var deserializedMessage = JsonSerializer.Deserialize<Message<IMessageParams>>(message);

      // TODO: заменить?
      if (deserializedMessage?.Equals(null) ?? true)
      {
        return;
      }

      switch (deserializedMessage.Type)
      {
        case Message<IMessageParams>.MessageType.Move:
          this.HandleMove(player, deserializedMessage);
          return;
      }
    }

    private void HandleMove(Player player, Message<IMessageParams> message)
    {
      if (!player.Id.Equals(this.ActivePlayer?.Id))
      {
        return;
      }

      /* делать ход */

      this.MakeFirstOrNextPlayerActive();
    }

    private void Log(params object[] args)
    {
      Console.WriteLine($"{this.Id}: {string.Join(' ', args)}");
    }
  }
}
