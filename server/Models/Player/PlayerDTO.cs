using System.Text.Json.Serialization;

namespace RuleChaos.Models.DTOs
{
  public class PlayerDTO(Player player)
  {
    [JsonPropertyName("id")]
    public Guid Id { get; } = player.Id;

    [JsonPropertyName("name")]
    public string Name { get; } = player.Name;

    [JsonPropertyName("isInRound")]
    public bool IsInRound { get; } = player.IsInRound;

    [JsonPropertyName("isActive")]
    public bool IsActive { get; } = player.IsActive;
  }
}