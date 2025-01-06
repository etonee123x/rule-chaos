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
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override MessageType Type
    {
      get => MessageType.PlayerJoinedSession;
    }

    [JsonIgnore]
    public override HistoryRecord HistoryRecord
    {
      get => new HistoryRecord(string.Join(' ', [$"Игрок {HistoryRecord.Accent(player)} подключается к сессии.", players.Count > 0 ? $"Текущий состав игроков: {string.Join(", ", players.Select(HistoryRecord.Accent))} (всего: {HistoryRecord.Accent(players.Count)})." : "Больше нет игроков!"]));
    }
  }
}
