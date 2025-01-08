using System.Text.Json.Serialization;

namespace RuleChaos.Utilities.DTOs
{
  public class TimerLimitsDTO()
  {
    [JsonPropertyName("startAt")]
    required public long StartAt { get; init; }

    [JsonPropertyName("endAt")]
    required public long EndAt { get; init; }
  }
}