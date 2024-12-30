using System.Text.Json.Serialization;
using RuleChaos.Models.Votings;

namespace RuleChaos.Models.Messages
{
  public class MessageVotingUpdate(Voting voting)
    : MessageFromServer
  {
    [JsonPropertyName("voting")]
    public VotingDTO Voting { get; } = voting.ToDTO();

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.VotingUpdate;
    }

    [JsonIgnore]
    public override HistoryRecord HistoryRecord
    {
      get => new HistoryRecord($"Запущено голосование {voting.Title}");
    }
  }
}
