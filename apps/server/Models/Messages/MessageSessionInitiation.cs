using System.Text.Json.Serialization;
using RuleChaos.Models.DTOs;

namespace RuleChaos.Models.Messages
{
  public class MessageSessionInitiation(GameSession gameSession)
    : MessageFromServer
  {
    [JsonPropertyName("gameSession")]
    public GameSessionDTO GameSession { get; } = gameSession.ToDTO();

    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
    {
      get => MessageType.SessionInitiation;
    }
  }
}
