using System.Text.Json.Serialization;
using RuleChaos.Models.Votings;
using RuleChaos.Models.Votings.DTOs;

namespace RuleChaos.Models.Messages
{
  public class MessageVotingInitiation(Voting voting)
    : MessageFromServer
  {
    [JsonPropertyName("activeVoting")]
    public VotingDTO ActiveVoting { get; } = voting.ToDTO();

    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
    {
      get => MessageType.VotingInitiation;
    }
  }
}
