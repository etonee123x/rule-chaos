using System.Text.Json.Serialization;

namespace RuleChaos.Models.DTOs
{
  public class GameSessionListingDTO(GameSession gameSession)
  {
    [JsonPropertyName("id")]
    public Guid Id { get; } = gameSession.Id;

    [JsonPropertyName("players")]
    public PlayerDTO[] Players { get; } = gameSession.Players.Select((player) => player.ToDTO()).ToArray();

    [JsonPropertyName("turnDuration")]
    public TimeSpan? TurnDuration { get; } = gameSession.TurnDuration;
  }
}