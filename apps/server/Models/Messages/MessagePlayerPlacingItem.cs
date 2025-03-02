using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerPlacingItem(ItemWithPosition itemWithPosition)
    : MessageFromClient
  {
    [JsonPropertyName("itemWithPosition")]
    public ItemWithPosition ItemWithPosition { get; } = itemWithPosition;

    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
    {
      get => MessageType.PlayerPlacingItem;
    }

    public override void Handle(GameSession gameSession, Player player)
    {
      gameSession.PlaceItem(player, this.ItemWithPosition);
    }
  }
}
