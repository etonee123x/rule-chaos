using System.Text.Json.Serialization;
using RuleChaos.Models.DTOs;

namespace RuleChaos.Models.Messages
{
  public class MessageSessionInitiation(Player player, GameSession gameSession)
    : MessageFromServer
  {
    [JsonPropertyName("player")]
    public PlayerDTO Player { get; } = player.ToDTO();

    [JsonPropertyName("sessionState")]
    public GameSessionDTO SessionState { get; } = gameSession.ToDTO();

    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
    {
      get => MessageType.SessionInitiation;
    }
  }
}
