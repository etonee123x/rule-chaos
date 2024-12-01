using System.Text.Json.Serialization;
using RuleChaos.Models.Players;

namespace RuleChaos.Models.Messages
{
  public class MessageNewActivePlayer(PlayerDTO player)
    : MessageFromServer
  {
    [JsonPropertyName("player")]
    public PlayerDTO Player { get; } = player;

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.NewActivePlayer;
    }
  }
}
