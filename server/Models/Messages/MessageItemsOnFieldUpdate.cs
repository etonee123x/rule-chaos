using System.Text.Json.Serialization;
using RuleChaos.Models.DTOs;

namespace RuleChaos.Models.Messages
{
  public class MessageItemsOnFieldUpdate(List<ItemWithPosition> itemsOnField)
    : MessageFromServer
  {
    [JsonPropertyName("itemsOnField")]
    public ItemWithPositionDTO[] ItemsOnField { get; } = itemsOnField.Select((itemOnField) => itemOnField.ToDTO()).ToArray();

    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
    {
      get => MessageType.ItemsOnFieldUpdate;
    }

    public override HistoryRecord HistoryRecord
    {
      get => new HistoryRecord("Предмет выставлен на поле.");
    }
  }
}
