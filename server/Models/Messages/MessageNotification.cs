using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessageNotification(string text)
    : MessageFromServer
  {
    [JsonPropertyName("text")]
    public string Text { get; } = text;

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.Notification;
    }

    [JsonIgnore]
    public override HistoryRecord? HistoryRecord
    {
      get => null;
    }
  }
}
