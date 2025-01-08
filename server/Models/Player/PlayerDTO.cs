using System.Text.Json.Serialization;

namespace RuleChaos.Models.DTOs
{
  public class PlayerDTO()
  {
    [JsonPropertyName("id")]
    required public Guid Id { get; init; }

    [JsonPropertyName("name")]
    required public string Name { get; init; }

    [JsonPropertyName("isInRound")]
    required public bool IsInRound { get; init; }

    [JsonPropertyName("isActive")]
    required public bool IsActive { get; init; }
  }
}