using System.Text.Json.Serialization;

namespace RuleChaos.Models.DTOs
{
  public class HistoryRecordDTO()
  {
    [JsonPropertyName("id")]
    required public Guid Id { get; init; }

    [JsonPropertyName("timestamp")]
    required public DateTime Timestamp { get; init; }

    [JsonPropertyName("message")]
    required public string Message { get; init; }
  }
}