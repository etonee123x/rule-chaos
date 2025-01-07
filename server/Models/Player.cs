using System.Net.WebSockets;
using System.Text;
using System.Text.Json.Serialization;
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

    public Player(WebSocket webSocket, GameSession gameSession)
    {
      this.Name = Player.GenerateName();
      this.WebSocket = webSocket;

      // тут пытаемся отправить клиенту игрока и состояние сессии
      this.SendMessage(new MessageSessionInitiation(this, gameSession));
    }

    public Task SendMessage(Message message) => this.WebSocket.SendAsync(
      Encoding.ASCII.GetBytes(message.ToString()),
      WebSocketMessageType.Text,
      true,
      CancellationToken.None);

    public PlayerDTO ToDTO() => new PlayerDTO(this);

    public override string ToString() => this.Name;
  }

  public class PlayerDTO(Player player)
  {
    [JsonPropertyName("id")]
    public Guid Id { get; } = player.Id;

    [JsonPropertyName("name")]
    public string Name { get; } = player.Name;

    [JsonPropertyName("isInRound")]
    public bool IsInRound { get; } = player.IsInRound;
  }
}
