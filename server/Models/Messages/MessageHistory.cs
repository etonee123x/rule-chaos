using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessageHistory(string[] history)
    : MessageFromServer
  {
    [JsonPropertyName("history")]
    public string[] History { get; } = history;

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.History;
    }
  }
}
