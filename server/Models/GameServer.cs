using System.Net.WebSockets;
using RuleChaos.Models.GameSessions;
using RuleChaos.Models.Players;

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

    public async Task HandleConnectionAttempt(Guid sessionId, HttpContext context)
    {
      var maybeGameSession = this.gameSessions.Find((gameSession) => gameSession.Id == sessionId);

      if (maybeGameSession == null)
      {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        await context.Response.WriteAsync("Session not found");
        return;
      }

      if (maybeGameSession.HasEnoughPlayers)
      {
        context.Response.StatusCode = StatusCodes.Status409Conflict;
        await context.Response.WriteAsync("Session has enough players");
        return;
      }

      await maybeGameSession.HandlePlayer(new Player(await context.WebSockets.AcceptWebSocketAsync()));
    }

    public void AddSession(GameSession gameSession)
    {
      this.gameSessions.Add(gameSession);
    }

    private void CleanupInactiveSessions()
    {
      var inactiveGameSessions = this.gameSessions
        .Where(session => session.IsInactive(GameServer.SessionTimeout))
        .ToList();

      foreach (var inactiveGameSession in inactiveGameSessions)
      {
        this.gameSessions.Remove(inactiveGameSession);
      }
    }
  }
}
