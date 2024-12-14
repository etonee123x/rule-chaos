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
    public override HistoryRecord HistoryRecord
    {
      get => new HistoryRecord(string.Join(' ', [$"Игрок {HistoryRecord.Accent(player)} отключается от сессии.", players.Count > 0 ? $"Текущий состав игроков: {string.Join(", ", players.Select(HistoryRecord.Accent))} (всего: {HistoryRecord.Accent(players.Count)})" : "Нет игроков!"]));
    }
  }
}
