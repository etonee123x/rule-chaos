using System.Text.Json.Serialization;
using RuleChaos.Models.Votings;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerWantsToStartRound : MessageFromClient
  {
    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.PlayerWantsToStartRound;
    }

    public override void Handle(GameSession gameSession, Player player)
    {
      var _ = new VotingStartRound(player, gameSession);
    }
  }
}
