using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerPlacingItem : MessageFromClient
  {
    [JsonPropertyName("itemsOnField")]
    required public ItemWithPositionDTO[] ItemsOnField { get; init; }

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.PlayerPlacingItem;
    }

    public override void Handle(GameSession gameSession, Player player)
    {
      Console.WriteLine(this);
    }
  }
}
