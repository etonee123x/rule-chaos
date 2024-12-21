using System.Text.Json;
using System.Text.Json.Serialization;

namespace RuleChaos.Models
{
  public class Item
  {
    [JsonPropertyName("text")]
    public string Text { get; }

    [JsonPropertyName("value")]
    public string Value { get; }

    [JsonConstructor]
    public Item(string value, string text)
    {
      this.Value = value;
      this.Text = text;
    }

    protected Item(Item item)
    {
      this.Value = item.Value;
      this.Text = item.Text;
    }

    public ItemDTO ToDTO()
    {
      return new ItemDTO(this);
    }
  }

  public class ItemDTO(Item item)
  {
    [JsonPropertyName("text")]
    public string Text { get; init; } = item.Text;

    [JsonPropertyName("value")]
    public string Value { get; init; } = item.Value;
  }

  public class Position(byte row, byte col)
  {
    [JsonPropertyName("row")]
    public byte Row { get; } = row;

    [JsonPropertyName("col")]
    public byte Col { get; } = col;

    public PositionDTO ToDTO()
    {
      return new PositionDTO(this);
    }
  }

  public class PositionDTO(Position position)
  {
    [JsonPropertyName("row")]
    public byte Row { get; init; } = position.Row;

    [JsonPropertyName("col")]
    public byte Col { get; init; } = position.Col;
  }

  public class ItemWithPosition(string value, string text, Position position)
    : Item(value, text)
  {
    [JsonPropertyName("position")]
    public Position Position { get; } = position;

    public new ItemWithPositionDTO ToDTO()
    {
      return new ItemWithPositionDTO(this);
    }
  }

  public class ItemWithPositionDTO(ItemWithPosition itemWithPosition)
    : ItemDTO(itemWithPosition)
  {
    [JsonPropertyName("position")]
    public PositionDTO Position { get; init; } = itemWithPosition.Position.ToDTO();
  }

  public class ItemGenerator
  {
    public static async Task<ItemGenerator> CreateInstanse()
    {
      using var streamReader = new StreamReader("items.json");
      var jsonAsString = await streamReader.ReadToEndAsync();
      var items = JsonSerializer.Deserialize<Item[]>(jsonAsString) ?? throw new Exception("NULL!");

      return new ItemGenerator(items);
    }

    private readonly Item[] items;

    private ItemGenerator(Item[] items)
    {
      this.items = items;
    }

    public Item Next()
    {
      return this.items[new Random().Next(this.items.Length)];
    }
  }
}
