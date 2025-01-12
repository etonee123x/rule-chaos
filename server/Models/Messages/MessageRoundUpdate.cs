using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessageRoundUpdate(bool isRoundActive)
    : MessageFromServer
  {
    [JsonPropertyName("isRoundActive")]
    public bool IsRoundActive { get; } = isRoundActive;

    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
    {
      get => MessageType.RoundUpdate;
    }
  }
}
