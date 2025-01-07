using System.Text.Json.Serialization;
using RuleChaos.Models.DTOs;

namespace RuleChaos.Models.Messages
{
  public class MessageItemsInHandUpdate(List<Item> itemsInHand)
    : MessageFromServer
  {
    [JsonPropertyName("itemsInHand")]
    public ItemDTO[] ItemsInHand { get; } = itemsInHand.Select((itemInHand) => itemInHand.ToDTO()).ToArray();

    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
    {
      get => MessageType.ItemsInHandUpdate;
    }

    public override HistoryRecord? HistoryRecord
    {
      get => null;
    }
  }
}
