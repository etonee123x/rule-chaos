using System.Text.Json.Serialization;

namespace RuleChaos.Models.Category
{
  public class Category(string value, string text)
  {
    public string Text { get; } = text;
    public string Value { get; } = value;

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