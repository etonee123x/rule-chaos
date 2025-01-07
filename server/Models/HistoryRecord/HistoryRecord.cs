using RuleChaos.Models.DTOs;

namespace RuleChaos.Models
{
  public class HistoryRecord(string message)
  {
    public string Message { get; } = message;

    public DateTime Timestamp { get; } = DateTime.Now;

    public Guid Id { get; } = Guid.NewGuid();

    public static string Accent(object value) => $"{{{value}}}";

    public HistoryRecordDTO ToDTO() => new HistoryRecordDTO(this);
  }
}
