using System.Text.Json.Serialization;
using RuleChaos.Models.Votings;

namespace RuleChaos.Models.Messages
{
  public class MessageVotingUpdate(Voting voting)
    : MessageFromServer
  {
    [JsonPropertyName("activeVoting")]
    public VotingDTO ActiveVoting { get; } = voting.ToDTO();

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.VotingUpdate;
    }

    [JsonIgnore]
    public override HistoryRecord? HistoryRecord
    {
      get => null;
    }
  }
}
