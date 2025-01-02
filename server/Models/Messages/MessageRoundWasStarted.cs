using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessageRoundWasStarted(List<Player> players)
    : MessageFromServer
  {
    [JsonPropertyName("players")]
    public PlayerDTO[] Players { get; } = players.Select((playerInRound) => playerInRound.ToDTO()).ToArray();

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
