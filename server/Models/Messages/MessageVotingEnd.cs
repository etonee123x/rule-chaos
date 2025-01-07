using System.Text.Json.Serialization;
using RuleChaos.Models.Votings;
using RuleChaos.Models.Votings.DTOs;

namespace RuleChaos.Models.Messages
{
  public class MessageVotingEnd(Voting voting)
    : MessageFromServer
  {
    [JsonPropertyName("activeVoting")]
    public VotingDTO ActiveVoting { get; } = voting.ToDTO();

    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
    {
      get => MessageType.VotingEnd;
    }

    [JsonIgnore]
    public override HistoryRecord HistoryRecord
    {
      get => new HistoryRecord($"Закончено голосование {HistoryRecord.Accent(voting.Title)}. Результат: {HistoryRecord.Accent(voting.Result == VoteValue.Positive ? "Успешно" : "Неуспешно")}");
    }
  }
}
