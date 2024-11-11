using System.Net.WebSockets;
using System.Text;
using RuleChaos.Models.Messages;

namespace RuleChaos.Models
{
  public class Player
  {
    public WebSocket WebSocket { get; }
    public Guid Id { get; }
    public string Name { get; }

    public Player(string name, WebSocket webSocket)
    {
      this.Name = name;
      this.WebSocket = webSocket;
      this.Id = Guid.NewGuid();
    }

    public Task SendMessage(Message message)
    {
      return this.WebSocket.SendAsync(Encoding.ASCII.GetBytes(message.ToString()), WebSocketMessageType.Text, true, CancellationToken.None);
    }
  }
}
