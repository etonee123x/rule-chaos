using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessageHistoryUpdate(HistoryRecord[] history)
    : MessageFromServer
  {
    [JsonPropertyName("history")]
    public HistoryRecordDTO[] History { get; } = history.Select((historyRecord) => historyRecord.ToDTO()).ToArray();

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.HistoryUpdate;
    }

    [JsonIgnore]
    public override HistoryRecord? HistoryRecord
    {
      get => null;
    }
  }
}
