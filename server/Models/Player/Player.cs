using System.Net.WebSockets;
using System.Text;
using RuleChaos.Models.DTOs;
using RuleChaos.Models.Messages;
using RuleChaos.Utilities;

namespace RuleChaos.Models
{
  public class Player
  {
    private static readonly RandomElementPicker<string> ElementPickerAdjective = new RandomElementPicker<string>([
      "Ленивый", "Грозный", "Весёлый", "Пушистый", "Тучный",
      "Скользкий", "Могучий", "Кислый", "Пронзительный", "Вялый",
      "Зловещий", "Шумный", "Гладкий", "Древний", "Наглый"
    ]);

    private static readonly RandomElementPicker<string> ElementPickerNoun = new RandomElementPicker<string>([
      "Титан", "Жаб", "Ёж", "Вепрь", "Дракон",
      "Хомяк", "Колобок", "Страж", "Пират", "Грифон",
      "Кабан", "Рысь", "Медведь", "Утконос", "Василёк"
    ]);

    private static string GenerateName() => string.Join(" ", Player.ElementPickerAdjective.Next(), Player.ElementPickerNoun.Next());

    public WebSocket WebSocket { get; }
    public Guid Id { get; } = Guid.NewGuid();
    public string Name { get; } = Player.GenerateName();
    public bool IsInRound { get; set; }
    public bool IsActive { get; set; }

    private GameSession gameSession;

    public Player(WebSocket webSocket, GameSession gameSession)
    {
      this.WebSocket = webSocket;
      this.gameSession = gameSession;

      this.SendMessage(new MessagePlayerInitiation(this));
      this.SendMessage(new MessageSessionInitiation(gameSession));
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
      this.gameSession.SendMessageToPlayers(new MessagePlayersUpdate(this.gameSession.Players, this.gameSession.TurnTimerLimits));
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

    public PlayerDTO ToDTO() => new PlayerDTO()
    {
      Id = this.Id,
      Name = this.Name,
      IsInRound = this.IsInRound,
      IsActive = this.IsActive,
    };

    public override string ToString() => this.Name;
  }
}
