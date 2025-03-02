using System.Text.Json.Serialization;
using RuleChaos.Models.Votings;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerVotes(VoteValue value)
    : MessageFromClient
  {
    [JsonPropertyName("value")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public VoteValue Value { get; } = value;

    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
    {
      get => MessageType.PlayerVotes;
    }

    public override void Handle(GameSession gameSession, Player player)
    {
      gameSession.ActiveVoting?.Vote(player, this.Value);
    }
  }
}
