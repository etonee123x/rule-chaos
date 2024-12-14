using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerLeftSession(Player player, List<Player> players)
    : MessageFromServer
  {
    [JsonPropertyName("player")]
    public PlayerDTO Player { get; } = player.ToDTO();

    [JsonPropertyName("players")]
    public PlayerDTO[] Players { get; } = players.Select((player) => player.ToDTO()).ToArray();

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.PlayerLeftSession;
    }

    [JsonIgnore]
    public override string HistoryRecord
    {
      get => $"Игрок {player} отключается от сессии. Текущий состав игроков: {string.Join(", ", players.Select((player) => player.ToString()))}. Всего: {players.Count}.";
    }
  }
}
