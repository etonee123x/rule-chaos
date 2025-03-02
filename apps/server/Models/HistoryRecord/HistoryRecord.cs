using RuleChaos.Models.DTOs;

namespace RuleChaos.Models
{
  public class HistoryRecord(string message)
  {
    private readonly string message = message;

    private readonly DateTime timestamp = DateTime.Now;

    private readonly Guid id = Guid.NewGuid();

    public static string Accent(object value) => $"{{{value}}}";

    public HistoryRecordDTO ToDTO() => new HistoryRecordDTO()
    {
      Id = this.id,
      Message = this.message,
      Timestamp = this.timestamp,
    };
  }
}
