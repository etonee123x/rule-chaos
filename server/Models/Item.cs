using System.Text.Json;
using System.Text.Json.Serialization;

namespace RuleChaos.Models
{
  public class Item
  {
    public string Text { get; }
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

  public class ItemDTO
  {
    [JsonPropertyName("text")]
    public string Text { get; init; }

    [JsonPropertyName("value")]
    public string Value { get; init; }

    public ItemDTO(Item item)
    {
      this.Text = item.Text;
      this.Value = item.Value;
    }
  }

  public class Position
  {
    public byte Row { get; }
    public byte Col { get; }

    public Position(byte row, byte col)
    {
      this.Row = row;
      this.Col = col;
    }

    public PositionDTO ToDTO()
    {
      return new PositionDTO(this);
    }
  }

  public class PositionDTO
  {
    [JsonPropertyName("row")]
    public byte Row { get; init; }

    [JsonPropertyName("col")]
    public byte Col { get; init; }

    public PositionDTO(Position position)
    {
      this.Row = position.Row;
      this.Col = position.Col;
    }
  }

  public class ItemWithPosition : Item
  {
    public Position Position { get; }

    public ItemWithPosition(string value, string text, Position position)
      : base(value, text)
    {
      this.Position = position;
    }

    public new ItemWithPositionDTO ToDTO()
    {
      return new ItemWithPositionDTO(this);
    }
  }

  public class ItemWithPositionDTO : ItemDTO
  {
    [JsonPropertyName("position")]
    public PositionDTO Position { get; init; }

    public ItemWithPositionDTO(ItemWithPosition itemWithPosition)
      : base(itemWithPosition)
    {
      this.Position = itemWithPosition.Position.ToDTO();
    }
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
