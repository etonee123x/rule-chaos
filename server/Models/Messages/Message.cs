using System.Text.Json;
using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public abstract class Message
  {
    [JsonPropertyName("type")]
    public abstract string Type { get; }

    public override string ToString()
    {
      return JsonSerializer.Serialize(this, this.GetType());
    }
  }

  public abstract class MessageFromClient : Message
  {
    public abstract void Handle(GameSession gameSession, Player player);

#pragma warning disable SA1000 // new
    public static readonly Dictionary<string, Type> MessageTypeToMessage = new()
#pragma warning restore SA1000
    {
    };
  }

  public abstract class MessageFromServer : Message
  {
    public abstract string HistoryRecord { get; }
  }
}
