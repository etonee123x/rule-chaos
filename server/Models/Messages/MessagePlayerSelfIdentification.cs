using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerSelfIdentification(Player player)
    : MessageFromServer
  {
    [JsonPropertyName("player")]
    public PlayerDTO Player { get; } = player.ToDTO();

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.PlayerSelfIdentification;
    }

    [JsonIgnore]
    public override HistoryRecord? HistoryRecord
    {
      get => null;
    }
  }
}
