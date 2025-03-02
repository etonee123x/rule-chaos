using RuleChaos.Utilities.DTOs;

namespace RuleChaos.Utilities
{
  public class TimerLimits
  {
    public long EndAt { get; }
    public long StartAt { get; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

    public TimerLimits(long endAt)
    {
      this.EndAt = endAt;
    }

    public TimerLimits(TimeSpan duration)
    {
      this.EndAt = this.StartAt + (long)duration.TotalMilliseconds;
    }

    public TimerLimitsDTO ToDTO() => new TimerLimitsDTO()
    {
      StartAt = this.StartAt,
      EndAt = this.EndAt,
    };
  }
}