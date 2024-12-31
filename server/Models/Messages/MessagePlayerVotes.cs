using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerVotes(string value)
    : MessageFromClient
  {
    [JsonPropertyName("value")]
    public string Value { get; } = value;

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.PlayerVotes;
    }

    public override void Handle(GameSession gameSession, Player player)
    {
      gameSession.ActiveVoting?.Vote(player, this.Value);
    }
  }
}
