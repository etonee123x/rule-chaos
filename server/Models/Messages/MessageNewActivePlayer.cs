using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessageNewActivePlayer(Player player)
    : MessageFromServer
  {
    [JsonPropertyName("player")]
    public PlayerDTO Player { get; } = player.ToDTO();

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.NewActivePlayer;
    }

    [JsonIgnore]
    public override string HistoryRecord
    {
      get => $"Ход игрока {player}.";
    }
  }
}
