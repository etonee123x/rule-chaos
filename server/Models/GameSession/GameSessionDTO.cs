using System.Text.Json.Serialization;
using RuleChaos.Models.Votings.DTOs;
using RuleChaos.Utilities.DTOs;

namespace RuleChaos.Models.DTOs
{
  public class GameSessionDTO(GameSession gameSession)
  {
    [JsonPropertyName("players")]
    public PlayerDTO[] Players { get; } = gameSession.Players.Select((player) => player.ToDTO()).ToArray();

    [JsonPropertyName("activePlayer")]
    public PlayerDTO? ActivePlayer { get; } = gameSession.ActivePlayer?.ToDTO();

    [JsonPropertyName("itemsInHand")]
    public ItemDTO[] ItemsInHand { get; } = gameSession.ItemsInHand.Select((itemInHand) => itemInHand.ToDTO()).ToArray();

    [JsonPropertyName("itemsOnField")]
    public ItemWithPositionDTO[] ItemsOnField { get; } = gameSession.ItemsOnField.Select((itemOnField) => itemOnField.ToDTO()).ToArray();

    [JsonPropertyName("history")]
    public HistoryRecordDTO[] History { get; } = gameSession.History.Select((historyRecord) => historyRecord.ToDTO()).ToArray();

    [JsonPropertyName("isRoundActive")]
    public bool IsRoundActive { get; } = gameSession.IsRoundActive;

    [JsonPropertyName("activeVoting")]
    public VotingDTO? ActiveVoting { get; } = gameSession.ActiveVoting?.ToDTO();

    [JsonPropertyName("activePlayerAbsoluteTimerLimits")]
    public AbsoluteTimerLimitsDTO? ActivePlayerAbsoluteTimerLimits { get; } = gameSession.ActivePlayerAbsoluteTimerLimits?.ToDTO();
  }
}