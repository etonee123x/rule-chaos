using System.Text.Json.Serialization;
using RuleChaos.Models.DTOs;

namespace RuleChaos.Models.Messages
{
  public class MessageRoundWasStarted(List<Player> players)
    : MessageFromServer
  {
    [JsonPropertyName("players")]
    public PlayerDTO[] Players { get; } = players.Select((playerInRound) => playerInRound.ToDTO()).ToArray();

    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
    {
      get => MessageType.RoundWasStarted;
    }
  }
}
