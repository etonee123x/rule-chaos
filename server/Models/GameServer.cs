using System.Collections.Concurrent;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

namespace RuleChaos.Models
{
  public class GameServer
  {
    private HttpListener HttpListener { get; set; }

    private ConcurrentDictionary<string, GameSession> GameSessions { get; set; }

    public GameServer(string prefix)
    {
      this.HttpListener = new HttpListener();
      this.HttpListener.Prefixes.Add(prefix);
      this.GameSessions = new ConcurrentDictionary<string, GameSession>();
    }

    public async Task StartAsync()
    {
      this.HttpListener.Start();
      Console.WriteLine("Server started...");

      while (true)
      {
        var context = await this.HttpListener.GetContextAsync();
        var maybeSessionId = context.Request.QueryString["session_code"];
        var maybePlayerName = context.Request.QueryString["player_name"];

        if (!context.Request.IsWebSocketRequest || string.IsNullOrEmpty(maybeSessionId) || string.IsNullOrEmpty(maybePlayerName))
        {
          context.Response.StatusCode = 400;
          context.Response.Close();
          continue;
        }

        var gameSession = this.GameSessions.GetOrAdd(maybeSessionId, maybeSessionId => new GameSession(maybeSessionId));
        if (gameSession.HasEnoughPlayers)
        {
          context.Response.StatusCode = 400;
          context.Response.Close();
          continue;
        }

        gameSession.HandlePlayer(new Player(maybePlayerName, (await context.AcceptWebSocketAsync(null)).WebSocket));
      }
    }
  }
}
