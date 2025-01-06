using System.Text.Json.Serialization;
using RuleChaos.Models.Votings;

namespace RuleChaos.Models.Messages
{
  public class MessageNotification(string title, NotificationType notificationType, string? description = null)
    : MessageFromServer
  {
    [JsonPropertyName("title")]
    public string Title { get; } = title;

    [JsonPropertyName("description")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Description { get; } = description;

    [JsonPropertyName("notificationType")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public NotificationType NotificationType { get; } = notificationType;

    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
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
