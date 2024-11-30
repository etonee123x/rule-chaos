using System.Text.Json.Serialization;

namespace RuleChaos.Models.Players
{
  public class PlayerDTO(Player player)
  {
    [JsonPropertyName("id")]
    public Guid Id { get; } = player.Id;

    [JsonPropertyName("name")]
    public string Name { get; } = player.Name;
  }
}
