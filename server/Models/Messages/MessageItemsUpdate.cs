using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessageItemsUpdate(ItemDTO[] itemsPrevious, ItemDTO[] itemsCurrent)
    : MessageFromServer
  {
    [JsonPropertyName("itemsPrevious")]
    public ItemDTO[] ItemsPrevious { get; } = itemsPrevious;

    [JsonPropertyName("itemsCurrent")]
    public ItemDTO[] ItemsCurrent { get; } = itemsCurrent;

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.ItemsUpdate;
    }

    public override HistoryRecord HistoryRecord
    {
      get => new HistoryRecord("Изменены предметы.");
    }
  }
}
