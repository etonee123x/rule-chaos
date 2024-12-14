using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerSelfIdentification(PlayerDTO playerDTO)
    : MessageFromServer
  {
    [JsonPropertyName("player")]
    public PlayerDTO Player { get; set; } = playerDTO;

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.PlayerSelfIdentification;
    }

    [JsonIgnore]
    public override string HistoryRecord
    {
      get => throw new NotImplementedException();
    }
  }
}
