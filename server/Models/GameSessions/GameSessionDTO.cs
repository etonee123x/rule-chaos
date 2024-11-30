using System.Text.Json.Serialization;
using RuleChaos.Models.Players;

namespace RuleChaos.Models.GameSessions
{
  public class GameSessionDTO(GameSession gameSession)
  {
    [JsonPropertyName("id")]
    public Guid Id { get; } = gameSession.Id;

    [JsonPropertyName("players")]
    public PlayerDTO[] Players { get; } = gameSession.PlayersDTOs;
  }
}
