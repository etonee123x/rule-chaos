using System.Text.Json.Serialization;
using RuleChaos.Models.DTOs;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerInitiation(Player thePlayer)
    : MessageFromServer
  {
    [JsonPropertyName("thePlayer")]
    public PlayerDTO ThePlayer { get; } = thePlayer.ToDTO();

    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
    {
      get => MessageType.PlayerInitiation;
    }
  }
}
