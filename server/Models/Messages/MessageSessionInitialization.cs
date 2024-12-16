using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessageSessionInitialization(Player player, GameSession gameSession)
    : MessageFromServer
  {
    [JsonPropertyName("player")]
    public PlayerDTO Player { get; } = player.ToDTO();

    [JsonPropertyName("sessionState")]
    public GameSessionDTO SessionState { get; } = gameSession.ToDTO();

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.SessionInitialization;
    }

    [JsonIgnore]
    public override HistoryRecord? HistoryRecord
    {
      get => null;
    }
  }
}
