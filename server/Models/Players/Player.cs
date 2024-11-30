using System.Net.WebSockets;
using System.Text;
using RuleChaos.Models.Messages;

namespace RuleChaos.Models.Players
{
  public class Player
  {
    public WebSocket WebSocket { get; }
    public Guid Id { get; } = Guid.NewGuid();
    public string Name { get; }

    public Player(string name, WebSocket webSocket)
    {
      this.Name = name;
      this.WebSocket = webSocket;

      // Пытаемся отправить игрока клиенту тут
      this.SendMessage(new MessagePlayerSelfIdentification(this.ToDTO()));
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
      return $"{this.Name} ({this.Id})";
    }
  }
}
