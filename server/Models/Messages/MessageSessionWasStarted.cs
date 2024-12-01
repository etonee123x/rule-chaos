using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessageSessionWasStarted()
    : MessageFromServer
  {
    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.SessionWasStarted;
    }
  }
}
