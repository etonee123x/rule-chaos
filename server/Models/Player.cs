using System.Net.WebSockets;
using System.Text;
using System.Text.Json.Serialization;
using RuleChaos.Models.Messages;

namespace RuleChaos.Models
{
  public class Player
  {
    public static string GenerateName()
    {
      string[] adjectives = [
        "Ленивый", "Грозный", "Весёлый", "Пушистый", "Тучный",
        "Скользкий", "Могучий", "Кислый", "Пронзительный", "Вялый",
        "Зловещий", "Шумный", "Гладкий", "Древний", "Наглый"
      ];

      string[] nouns = [
        "Титан", "Жаб", "Ёж", "Вепрь", "Дракон",
        "Хомяк", "Колобок", "Страж", "Пират", "Грифон",
        "Кабан", "Рысь", "Медведь", "Утконос", "Василёк"
      ];

      var random = new Random();

      var adjective = adjectives[random.Next(adjectives.Length)];
      var noun = nouns[random.Next(nouns.Length)];

      return string.Join(" ", adjective, noun);
    }

    public WebSocket WebSocket { get; }
    public Guid Id { get; } = Guid.NewGuid();
    public string Name { get; }

    public Player(WebSocket webSocket)
    {
      this.Name = Player.GenerateName();
      this.WebSocket = webSocket;

      // Пытаемся отправить игрока клиенту тут
      this.SendMessage(new MessagePlayerSelfIdentification(this));
    }

    public Task SendMessage(Message message)
    {
      return this.WebSocket.SendAsync(Encoding.ASCII.GetBytes(message.ToString()), WebSocketMessageType.Text, true, CancellationToken.None);
    }

    public PlayerDTO ToDTO()
    {
      return new PlayerDTO(this);
    }

    public override string ToString()
    {
      return this.Name;
    }
  }

  public class PlayerDTO(Player player)
  {
    [JsonPropertyName("id")]
    public Guid Id { get; } = player.Id;

    [JsonPropertyName("name")]
    public string Name { get; } = player.Name;
  }
}
