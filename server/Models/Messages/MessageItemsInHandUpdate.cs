using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessageItemsInHandUpdate(List<Item> itemsInHand)
    : MessageFromServer
  {
    [JsonPropertyName("itemsInHand")]
    public ItemDTO[] ItemsInHand { get; } = itemsInHand.Select((itemInHand) => itemInHand.ToDTO()).ToArray();

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.ItemsInHandUpdate;
    }

    public override HistoryRecord? HistoryRecord
    {
      get => null;
    }
  }
}
