using System.Text.Json.Serialization;

namespace RuleChaos.Models
{
  public class HistoryRecord(string message)
  {
    public string Message { get; } = message;

    public DateTime Timestamp { get; } = DateTime.Now;

    public Guid Id { get; } = Guid.NewGuid();

    public static string Accent(object value)
    {
      return $"{{{value}}}";
    }

    public HistoryRecordDTO ToDTO()
    {
      return new HistoryRecordDTO(this);
    }
  }

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