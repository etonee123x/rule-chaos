using System.Text.Json;
using System.Text.Json.Serialization;

namespace RuleChaos.Models.Item
{
  public class Item
  {
    public string Text { get; }
    public string Value { get; }
    public Category.Category[] Categories { get; }

    file Item(string value, string text, Category.Category[] categories)
    {
      this.Value = value;
      this.Text = text;
      this.Categories = categories;
    }

    public ItemDTO ToDTO()
    {
      return new ItemDTO(this);
    }
  }

  public class ItemDTO(Item item)
  {
    [JsonPropertyName("text")]
    public string Text { get; } = item.Text;

    [JsonPropertyName("value")]
    public string Value { get; } = item.Value;
  }

  public class ItemGenerator
  {
    public static async Task<ItemGenerator> BuildItemGenerator()
    {
      using var streamReader = new StreamReader("./items.json");
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