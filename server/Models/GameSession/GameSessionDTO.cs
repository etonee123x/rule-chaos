using System.Text.Json.Serialization;
using RuleChaos.Models.Votings.DTOs;
using RuleChaos.Utilities.DTOs;

namespace RuleChaos.Models.DTOs
{
  public class GameSessionDTO()
  {
    [JsonPropertyName("players")]
    required public PlayerDTO[] Players { get; init; }

    [JsonPropertyName("itemsInHand")]
    required public ItemDTO[] ItemsInHand { get; init; }

    [JsonPropertyName("itemsOnField")]
    required public ItemWithPositionDTO[] ItemsOnField { get; init; }

    [JsonPropertyName("history")]
    required public HistoryRecordDTO[] History { get; init; }

    [JsonPropertyName("isRoundActive")]
    required public bool IsRoundActive { get; init; }

    [JsonPropertyName("activeVoting")]
    required public VotingDTO? ActiveVoting { get; init; }

    [JsonPropertyName("turnTimerLimits")]
    required public TimerLimitsDTO? TurnTimerLimits { get; init; }
  }
}