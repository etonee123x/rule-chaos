using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessageRoundWasStarted(List<Player> playersInRound)
    : MessageFromServer
  {
    [JsonPropertyName("playersInRound")]
    public PlayerDTO[] PlayersInRound { get; } = playersInRound.Select((playerInRound) => playerInRound.ToDTO()).ToArray();

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.RoundWasStarted;
    }

    [JsonIgnore]
    public override HistoryRecord HistoryRecord
    {
      get => new HistoryRecord("Раунд начался!");
    }
  }
}
