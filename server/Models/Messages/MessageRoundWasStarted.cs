using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessageRoundWasStarted()
    : MessageFromServer
  {
    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.RoundWasStarted;
    }
  }
}
