using System.Text.Json.Serialization;

namespace RuleChaos.Models.DTOs
{
  public class ItemDTO()
  {
    [JsonPropertyName("id")]
    required public Guid Id { get; init; }

    [JsonPropertyName("text")]
    required public string Text { get; init; }

    [JsonPropertyName("value")]
    required public string Value { get; init; }
  }

  public class PositionDTO()
  {
    [JsonPropertyName("row")]
    required public byte Row { get; init; }

    [JsonPropertyName("col")]
    required public byte Col { get; init; }
  }

  public class ItemWithPositionDTO()
    : ItemDTO()
  {
    [JsonPropertyName("position")]
    required public PositionDTO Position { get; init; }
  }
}