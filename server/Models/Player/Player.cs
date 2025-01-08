using System.Net.WebSockets;
using System.Text;
using RuleChaos.Models.DTOs;
using RuleChaos.Models.Messages;
using RuleChaos.Utilities;

namespace RuleChaos.Models
{
  public class Player
  {
    private static RandomElementPicker<string> elementPickerAdjective = new RandomElementPicker<string>([
      "Ленивый", "Грозный", "Весёлый", "Пушистый", "Тучный",
      "Скользкий", "Могучий", "Кислый", "Пронзительный", "Вялый",
      "Зловещий", "Шумный", "Гладкий", "Древний", "Наглый"
    ]);

    private static RandomElementPicker<string> elementPickerNoun = new RandomElementPicker<string>([
      "Титан", "Жаб", "Ёж", "Вепрь", "Дракон",
      "Хомяк", "Колобок", "Страж", "Пират", "Грифон",
      "Кабан", "Рысь", "Медведь", "Утконос", "Василёк"
    ]);

    public static string GenerateName() => string.Join(" ", Player.elementPickerAdjective.Next(), Player.elementPickerNoun.Next());

    public WebSocket WebSocket { get; }
    public Guid Id { get; } = Guid.NewGuid();
    public string Name { get; }
    public bool IsInRound { get; set; }
    public bool IsActive { get; set; }

    private GameSession gameSession;

    public Player(WebSocket webSocket, GameSession gameSession)
    {
      this.Name = Player.GenerateName();
      this.WebSocket = webSocket;
      this.gameSession = gameSession;

      // тут пытаемся отправить клиенту игрока и состояние сессии
      this.SendMessage(new MessageSessionInitiation(this, gameSession));
    }

    public void OnDisconnect()
    {
      Player? maybeNewActivePlayer = null;
      if (this.gameSession.ActivePlayer is not null && this.gameSession.ActivePlayer.Equals(this))
      {
        this.gameSession.MakeFirstOrNextPlayerActive();
        maybeNewActivePlayer = this.gameSession.ActivePlayer;
      }

      this.gameSession.Players.Remove(this);
      this.gameSession.SendMessageToPlayers(new MessagePlayersUpdate(this.gameSession.Players, this.gameSession.ActivePlayerAbsoluteTimerLimits));
      this.gameSession.AddHistoryRecord(new HistoryRecord($"Игрок {HistoryRecord.Accent(this)} отключился."));
      if (maybeNewActivePlayer is not null)
      {
        this.gameSession.AddHistoryRecord(new HistoryRecord($"Ход игрока {HistoryRecord.Accent(maybeNewActivePlayer)}."));
      }
    }

    public Task SendMessage(Message message) => this.WebSocket.SendAsync(
      Encoding.ASCII.GetBytes(message.ToString()),
      WebSocketMessageType.Text,
      true,
      CancellationToken.None);

    public PlayerDTO ToDTO() => new PlayerDTO(this);

    public override string ToString() => this.Name;
  }
}
