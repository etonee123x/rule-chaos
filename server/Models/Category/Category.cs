using System.Text.Json.Serialization;

namespace RuleChaos.Models.Category
{
  public class Category
  {
    public string Text { get; }
    public string Value { get; }

    [JsonConstructor]
    private Category(string value, string text)
    {
      this.Text = text;
      this.Value = value;
    }

    public CategoryDTO ToDTO()
    {
      return new CategoryDTO(this);
    }
  }

  public class CategoryDTO(Category category)
  {
    [JsonPropertyName("text")]
    public string Text { get; } = category.Text;

    [JsonPropertyName("value")]
    public string Value { get; } = category.Value;
  }
}
