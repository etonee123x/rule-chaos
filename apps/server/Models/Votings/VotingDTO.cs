using System.Text.Json.Serialization;
using RuleChaos.Utilities.DTOs;

namespace RuleChaos.Models.Votings.DTOs
{
  public class VotingDTO()
  {
    [JsonPropertyName("title")]
    required public string Title { get; init; }

    [JsonPropertyName("playersVotedPositiveIds")]
    required public Guid[] PlayersVotedPositiveIds { get; init; }

    [JsonPropertyName("playersVotedNegativeIds")]
    required public Guid[] PlayersVotedNegativeIds { get; init; }

    [JsonPropertyName("timerLimits")]
    required public TimerLimitsDTO TimerLimits { get; init; }

    [JsonPropertyName("result")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    required public VoteValue? Result { get; init; }
  }
}