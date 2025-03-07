using RuleChaos.Models.DTOs;

namespace RuleChaos.Models
{
  public class GameServer
  {
    public List<GameSessionListingDTO> ActiveGameSessionsDTOs
    {
      get => this.gameSessions.FindAll((gameSession) => !gameSession.IsPrivate).ConvertAll((gameSession) => gameSession.ToListingDTO());
    }

    private List<GameSession> gameSessions = [];

    public GameServer()
    {
      SessionsCleaner.StartCleanupInterval(this.gameSessions);
    }

    public async Task HandleConnectionAttempt(Guid sessionId, HttpContext context)
    {
      var maybeGameSession = this.gameSessions.Find((gameSession) => gameSession.Id == sessionId);

      if (maybeGameSession is null)
      {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        await context.Response.WriteAsync("Session not found");
        return;
      }

      if (maybeGameSession.HasMaximumPlayers)
      {
        context.Response.StatusCode = StatusCodes.Status409Conflict;
        await context.Response.WriteAsync("Session has enough players");
        return;
      }

      await maybeGameSession.HandlePlayer(new Player(await context.WebSockets.AcceptWebSocketAsync(), maybeGameSession));
    }

    public void AddSession(GameSession gameSession)
    {
      this.gameSessions.Add(gameSession);
    }
  }

  internal static class SessionsCleaner
  {
    private static readonly TimeSpan SessionTimeout = TimeSpan.FromMinutes(50);
    private static readonly TimeSpan CleanupInterval = TimeSpan.FromMinutes(1);
    private static readonly object Lock = new object();

    internal static void StartCleanupInterval(List<GameSession> gameSessions)
    {
      _ = new Timer(
        _ =>
        {
          lock (Lock)
          {
            gameSessions.RemoveAll(gameSession => gameSession.IsInactive(SessionTimeout));
          }
        },
        null,
        SessionsCleaner.CleanupInterval,
        SessionsCleaner.CleanupInterval);
    }
  }
}
