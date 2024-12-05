using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerJoinedSession(PlayerDTO player, PlayerDTO[] players)
    : MessageFromServer
  {
    [JsonPropertyName("player")]
    public PlayerDTO Player { get; set; } = player;

    [JsonPropertyName("players")]
    public PlayerDTO[] Players { get; set; } = players;

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.PlayerJoinedSession;
    }
  }
}
