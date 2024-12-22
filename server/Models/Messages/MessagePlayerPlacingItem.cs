using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerPlacingItem(ItemWithPosition itemWithPosition)
    : MessageFromClient
  {
    [JsonPropertyName("itemWithPosition")]
    public ItemWithPosition ItemWithPosition { get; } = itemWithPosition;

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.PlayerPlacingItem;
    }

    public override void Handle(GameSession gameSession, Player player)
    {
      Console.WriteLine(this.ItemWithPosition);
      gameSession.PlaceItem(player, this.ItemWithPosition);
    }
  }
}
