using System.Text.Json.Serialization;
using RuleChaos.Models.DTOs;
using RuleChaos.Utilities;
using RuleChaos.Utilities.DTOs;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayersUpdate(List<Player> players, AbsoluteTimerLimits? activePlayerAbsoluteTimerLimits)
    : MessageFromServer
  {
    [JsonPropertyName("players")]
    public PlayerDTO[] Players { get; } = players.Select((player) => player.ToDTO()).ToArray();

    [JsonPropertyName("activePlayerAbsoluteTimerLimits")]
    public AbsoluteTimerLimitsDTO? ActivePlayerAbsoluteTimerLimits { get; } = activePlayerAbsoluteTimerLimits?.ToDTO();

    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
    {
      get => MessageType.PlayersUpdate;
    }
  }
}
