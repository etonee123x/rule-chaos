using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessageItemsOnFieldUpdate(ItemWithPosition[] itemsOnField)
    : MessageFromServer
  {
    [JsonPropertyName("itemsOnField")]
    public ItemWithPositionDTO[] ItemsOnField { get; } = itemsOnField.Select((itemOnField) => itemOnField.ToDTO()).ToArray();

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.ItemsUpdate;
    }

    public override HistoryRecord HistoryRecord
    {
      get => new HistoryRecord("Предмет выставлен на поле");
    }
  }
}
