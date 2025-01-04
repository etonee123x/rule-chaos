using System.Text.Json.Serialization;

namespace RuleChaos.Models
{
  public class AbsoluteTimerLimits
  {
    public long EndAt { get; }
    public long StartAt { get; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

    public AbsoluteTimerLimits(long endAt)
    {
      this.EndAt = endAt;
    }

    public AbsoluteTimerLimits(TimeSpan duration)
    {
      this.EndAt = this.StartAt + (long)duration.TotalMilliseconds;
    }

    public AbsoluteTimerLimitsDTO ToDTO() => new AbsoluteTimerLimitsDTO(this);
  }

  public class AbsoluteTimerLimitsDTO(AbsoluteTimerLimits absoluteTimer)
  {
    [JsonPropertyName("startAt")]
    public long StartAt { get; } = absoluteTimer.StartAt;

    [JsonPropertyName("endAt")]
    public long EndAt { get; } = absoluteTimer.EndAt;
  }
}