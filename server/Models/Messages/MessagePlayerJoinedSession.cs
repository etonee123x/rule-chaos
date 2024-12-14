using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerJoinedSession(Player player, List<Player> players)
    : MessageFromServer
  {
    [JsonPropertyName("player")]
    public PlayerDTO Player { get; } = player.ToDTO();

    [JsonPropertyName("players")]
    public PlayerDTO[] Players { get; } = players.Select((player) => player.ToDTO()).ToArray();

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.PlayerJoinedSession;
    }

    [JsonIgnore]
    public override string HistoryRecord
    {
      get => $"Игрок {player} подключается к сессии. Текущий состав игроков: {string.Join(", ", players.Select((player) => player.ToString()))}. Всего: {players.Count}.";
    }
  }
}
