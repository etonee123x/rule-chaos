using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerPlacingItem : MessageFromClient
  {
    [JsonPropertyName("itemOnField")]
    required public ItemWithPosition ItemOnField { get; init; }

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
