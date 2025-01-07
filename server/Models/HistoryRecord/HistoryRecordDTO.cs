using System.Text.Json.Serialization;

namespace RuleChaos.Models.DTOs
{
  public class HistoryRecordDTO(HistoryRecord historyRecord)
  {
    [JsonPropertyName("id")]
    public Guid Id { get; } = historyRecord.Id;

    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; } = historyRecord.Timestamp;

    [JsonPropertyName("message")]
    public string Message { get; } = historyRecord.Message;
  }
}