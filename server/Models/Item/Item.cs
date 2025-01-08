using System.Text.Json;
using System.Text.Json.Serialization;
using RuleChaos.Models.DTOs;

namespace RuleChaos.Models
{
  public class Item
  {
    [JsonPropertyName("text")]
    public string Text { get; }

    [JsonPropertyName("value")]
    public string Value { get; }

    [JsonPropertyName("id")]
    public Guid Id { get; init; } = Guid.NewGuid();

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

    public override bool Equals(object? obj)
    {
      if (obj is Item other)
      {
        return this.Id == other.Id;
      }

      return false;
    }

    public override int GetHashCode() => this.Id.GetHashCode();

    public ItemDTO ToDTO() => new ItemDTO()
    {
      Id = this.Id,
      Text = this.Text,
      Value = this.Value,
    };
  }

  public class Position(byte row, byte col)
  {
    [JsonPropertyName("row")]
    public byte Row { get; } = row;

    [JsonPropertyName("col")]
    public byte Col { get; } = col;

    public override bool Equals(object? obj)
    {
      if (obj is Position other)
      {
        return this.Row == other.Row && this.Col == other.Col;
      }

      return false;
    }

    public override int GetHashCode() => HashCode.Combine(this.Row, this.Col);

    public override string ToString() => $"{this.Row}:{this.Col}";

    public PositionDTO ToDTO() => new PositionDTO()
    {
      Row = this.Row,
      Col = this.Col,
    };
  }

  public class ItemWithPosition : Item
  {
    [JsonPropertyName("position")]
    public Position Position { get; }

    public ItemWithPosition(string value, string text, Position position, Guid id)
      : base(value, text)
    {
      this.Id = id;
      this.Position = position;
    }

    public new ItemWithPositionDTO ToDTO() => new ItemWithPositionDTO()
    {
      Id = this.Id,
      Text = this.Text,
      Value = this.Value,
      Position = this.Position.ToDTO(),
    };
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

    public Item Next() => this.items[new Random().Next(this.items.Length)];
  }
}
