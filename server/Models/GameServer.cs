namespace RuleChaos.Models
{
  public class GameServer
  {
    public List<GameSessionDTO> ActiveGameSessionsDTOs
    {
      get => this.gameSessions.FindAll((gameSession) => !gameSession.IsPrivate).ConvertAll((gameSession) => gameSession.ToDTO());
    }

    private List<GameSession> gameSessions = [];

    public GameServer()
    {
      // TODO: Не работает, скорее всего, нужен ref
      SessionsCleaner.StartCleanupInterval(this.gameSessions);
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
  }

  internal static class SessionsCleaner
  {
    private static readonly TimeSpan SessionTimeout = TimeSpan.FromMinutes(5);
    private static readonly TimeSpan CleanupInterval = TimeSpan.FromMinutes(1);

    internal static void StartCleanupInterval(List<GameSession> gameSessions)
    {
      var timer = new Timer(
        (state) =>
        {
          gameSessions = gameSessions.FindAll((gameSession) => !gameSession.IsInactive(SessionsCleaner.SessionTimeout));
        },
        null,
        SessionsCleaner.CleanupInterval,
        SessionsCleaner.CleanupInterval);
    }
  }
}
