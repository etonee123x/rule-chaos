using RuleChaos.Utilities.DTOs;

namespace RuleChaos.Utilities
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
}