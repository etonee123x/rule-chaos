using System.Text.Json.Serialization;
using RuleChaos.Models.Players;

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
  }
}
