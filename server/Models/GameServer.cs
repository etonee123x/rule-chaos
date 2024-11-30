using System.Net.WebSockets;
using RuleChaos.Models.GameSessions;

namespace RuleChaos.Models
{
  public class GameServer
  {
    public List<GameSessionDTO> ActiveGameSessionsDTOs
    {
      get => this.gameSessions.FindAll((gameSession) => !gameSession.IsPrivate).ConvertAll((gameSession) => gameSession.ToDTO());
    }

    private static readonly TimeSpan SessionTimeout = TimeSpan.FromMinutes(5);
    private static readonly TimeSpan CleanupInterval = TimeSpan.FromMinutes(1);
    private readonly List<GameSession> gameSessions = [];

    public GameServer()
    {
      new Timer((state) => this.CleanupInactiveSessions(), null, GameServer.CleanupInterval, GameServer.CleanupInterval);
    }

    public Task HandleWebSocket(WebSocket webSocket)
    {
      return new Task(() => { });
    }

    public void AddSession(GameSession gameSession)
    {
      this.gameSessions.Add(gameSession);
    }

    private void CleanupInactiveSessions()
    {
      var now = DateTime.UtcNow;

      this.gameSessions.ForEach(gameSession =>
      {
        if (!gameSession.IsInactive(GameServer.SessionTimeout))
        {
          return;
        }

        this.gameSessions.Remove(gameSession);
      });
    }
  }
}
