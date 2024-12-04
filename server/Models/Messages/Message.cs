using System.Text.Json;
using System.Text.Json.Serialization;
using RuleChaos.Models.GameSessions;
using RuleChaos.Models.Players;

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
      { MessageType.TEST_PlayerClickedButton, typeof(Message_TEST_PlayerClickedButton) },
    };
  }

  public abstract class MessageFromServer : Message
  {
  }
}
