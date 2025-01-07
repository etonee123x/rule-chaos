using System.Text.Json.Serialization;

namespace RuleChaos.Utilities.DTOs
{
  public class AbsoluteTimerLimitsDTO(AbsoluteTimerLimits absoluteTimer)
  {
    [JsonPropertyName("startAt")]
    public long StartAt { get; } = absoluteTimer.StartAt;

    [JsonPropertyName("endAt")]
    public long EndAt { get; } = absoluteTimer.EndAt;
  }
}