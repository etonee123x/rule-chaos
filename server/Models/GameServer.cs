using System.Net.WebSockets;
using RuleChaos.Models.GameSessions;

namespace RuleChaos.Models
{
  public class GameServer()
  {
    public List<GameSession> GameSessions { get; set; } = [];

    public Task HandleWebSocket(WebSocket webSocket)
    {
      return new Task(() => { });
    }
  }
}
