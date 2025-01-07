using System.Text.Json.Serialization;
using RuleChaos.Utilities.DTOs;

namespace RuleChaos.Models.Votings.DTOs
{
  public class VotingDTO(Voting voting)
  {
    [JsonPropertyName("title")]
    public string Title { get; } = voting.Title;

    [JsonPropertyName("playersVotedPositiveIds")]
    public Guid[] PlayersVotedPositiveIds { get; } = voting.PlayersVotedPositiveIds.ToArray();

    [JsonPropertyName("playersVotedNegativeIds")]
    public Guid[] PlayersVotedNegativeIds { get; } = voting.PlayersVotedNegativeIds.ToArray();

    [JsonPropertyName("absoluteTimerLimits")]
    public AbsoluteTimerLimitsDTO AbsoluteTimerLimits { get; } = voting.AbsoluteTimerLimits.ToDTO();

    [JsonPropertyName("result")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public VoteValue? Result { get; } = voting.Result;
  }
}