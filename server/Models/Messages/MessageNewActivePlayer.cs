using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessageNewActivePlayer(Player player, AbsoluteTimerLimits? activePlayerAbsoluteTimerLimits)
    : MessageFromServer
  {
    [JsonPropertyName("player")]
    public PlayerDTO Player { get; } = player.ToDTO();

    [JsonPropertyName("activePlayerAbsoluteTimerLimits")]
    public AbsoluteTimerLimitsDTO? ActivePlayerAbsoluteTimerLimits { get; } = activePlayerAbsoluteTimerLimits?.ToDTO();

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.NewActivePlayer;
    }

    [JsonIgnore]
    public override HistoryRecord HistoryRecord
    {
      get => new HistoryRecord($"Ход игрока {HistoryRecord.Accent(player)}.");
    }
  }
}
