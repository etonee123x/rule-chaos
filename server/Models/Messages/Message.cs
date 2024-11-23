using System.Text.Json;
using RuleChaos.Models.Players;

namespace RuleChaos.Models.Messages
{
  public abstract class Message
  {
    public abstract string Type { get; }

    public override string ToString()
    {
      return JsonSerializer.Serialize(this, this.GetType());
    }
  }

  public abstract class MessageFromClient : Message
  {
    public abstract void Handle(GameSession gameSession, Player player);
  }

  public abstract class MessageFromServer : Message
  {
  }
}
