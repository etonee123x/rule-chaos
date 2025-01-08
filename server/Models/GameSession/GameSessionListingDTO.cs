using System.Text.Json.Serialization;

namespace RuleChaos.Models.DTOs
{
  public class GameSessionListingDTO()
  {
    [JsonPropertyName("id")]
    required public Guid Id { get; init; }

    [JsonPropertyName("players")]
    required public PlayerDTO[] Players { get; init; }

    [JsonPropertyName("turnDuration")]
    required public TimeSpan? TurnDuration { get; init; }
  }
}