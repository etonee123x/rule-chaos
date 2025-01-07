using System.Text.Json.Serialization;

namespace RuleChaos.Models.DTOs
{
  public class ItemDTO(Item item)
  {
    [JsonPropertyName("id")]
    public Guid Id { get; init; } = item.Id;

    [JsonPropertyName("text")]
    public string Text { get; init; } = item.Text;

    [JsonPropertyName("value")]
    public string Value { get; init; } = item.Value;
  }

  public class PositionDTO(Position position)
  {
    [JsonPropertyName("row")]
    public byte Row { get; init; } = position.Row;

    [JsonPropertyName("col")]
    public byte Col { get; init; } = position.Col;
  }

  public class ItemWithPositionDTO(ItemWithPosition itemWithPosition)
    : ItemDTO(itemWithPosition)
  {
    [JsonPropertyName("position")]
    public PositionDTO Position { get; init; } = itemWithPosition.Position.ToDTO();
  }
}