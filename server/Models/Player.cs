using System.Net.WebSockets;

namespace RuleChaos.Models
{
  public class Player
  {
    public WebSocket WebSocket { get; set; }
    public Guid Id { get; set; }

    public Player(WebSocket webSocket)
    {
      this.WebSocket = webSocket;
      this.Id = Guid.NewGuid();
    }
  }
}
