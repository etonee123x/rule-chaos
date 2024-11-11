using System.Text.Json;

namespace RuleChaos.Models.Messages
{
  public abstract class Message
  {
    public abstract string Type { get; }

    public override string ToString()
    {
      return JsonSerializer.Serialize(this, this.GetType());
    }
  }
}
