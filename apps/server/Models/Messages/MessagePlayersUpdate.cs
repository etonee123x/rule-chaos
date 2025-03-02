using System.Text.Json.Serialization;
using RuleChaos.Models.DTOs;
using RuleChaos.Utilities;
using RuleChaos.Utilities.DTOs;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayersUpdate(List<Player> players, TimerLimits? turnTimerLimits)
    : MessageFromServer
  {
    [JsonPropertyName("players")]
    public PlayerDTO[] Players { get; } = players.Select((player) => player.ToDTO()).ToArray();

    [JsonPropertyName("turnTimerLimits")]
    public TimerLimitsDTO? TurnTimerLimits { get; } = turnTimerLimits?.ToDTO();

    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
    {
      get => MessageType.PlayersUpdate;
    }
  }
}
