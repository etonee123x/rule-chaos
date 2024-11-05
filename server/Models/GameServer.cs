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
        if (!context.Request.IsWebSocketRequest)
        {
          context.Response.StatusCode = 400;
          context.Response.Close();
          continue;
        }

        var sessionId = context.Request.QueryString["session_code"];
        if (string.IsNullOrEmpty(sessionId))
        {
          context.Response.StatusCode = 400;
          context.Response.Close();
          continue;
        }

        Console.WriteLine("Новое подключение!");

        var gameSession = this.GameSessions.GetOrAdd(sessionId, sessionId => new GameSession(sessionId));
        var playerWebSocket = (await context.AcceptWebSocketAsync(null)).WebSocket;

        if (gameSession.IsReady)
        {
          await playerWebSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Session full", CancellationToken.None);
          context.Response.StatusCode = 400;
          context.Response.Close();
          continue;
        }

        var player = new Player(playerWebSocket);

        // Мб лучше перенести в GameSession.HandlePlayerMessage ???
        gameSession.AddPlayer(player);

        if (!gameSession.IsReady)
        {
          continue;
        }

        Console.WriteLine("Мы тут, сессия началась!");

        Task.Run(async () =>
        {
          var buffer = new byte[1024 * 4];

          while (player.WebSocket.State == WebSocketState.Open)
          {
            var result = await player.WebSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            var message = Encoding.UTF8.GetString(buffer, 0, result.Count);

            if (result.MessageType == WebSocketMessageType.Close)
            {
              break;
            }

            gameSession.HandlePlayerMessage(player, message);
          }
        });
      }
    }
  }
}
