using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerJoinedSession(Player player, List<Player> playersInSession)
    : MessageFromServer
  {
    [JsonPropertyName("player")]
    public PlayerDTO Player { get; } = player.ToDTO();

    [JsonPropertyName("playersInSession")]
    public PlayerDTO[] PlayersInSession { get; } = playersInSession.Select((player) => player.ToDTO()).ToArray();

    [JsonPropertyName("type")]
    public override string Type
    {
      get => MessageType.PlayerJoinedSession;
    }

    [JsonIgnore]
    public override HistoryRecord HistoryRecord
    {
      get => new HistoryRecord(string.Join(' ', [$"Игрок {HistoryRecord.Accent(player)} подключается к сессии.", playersInSession.Count > 0 ? $"Текущий состав игроков: {string.Join(", ", playersInSession.Select(HistoryRecord.Accent))} (всего: {HistoryRecord.Accent(playersInSession.Count)})." : "Больше нет игроков!"]));
    }
  }
}
