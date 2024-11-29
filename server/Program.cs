using System.Text;
using RuleChaos.Models;
using RuleChaos.Models.GameSessions;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var gameServer = new GameServer();

app.MapGet("/sessions", async (context) =>
{
  await context.Response.WriteAsJsonAsync(gameServer.GameSessions.FindAll((gameSession) => !gameSession.IsPrivate).ConvertAll((gameSession) => gameSession.ToDTO()));
});

app.MapPost("/sessions", async (context) =>
{
  var isPrivate = bool.TryParse(context.Request.Form["isPrivate"], out bool result) && result;
  var gameSession = new GameSession(isPrivate);
  gameServer.GameSessions.Add(gameSession);

  await context.Response.WriteAsJsonAsync(gameSession.ToDTO());
});

app.UseWebSockets();

app.Map("/ws", async context =>
{
  if (!context.WebSockets.IsWebSocketRequest)
  {
    context.Response.StatusCode = StatusCodes.Status400BadRequest;
    await context.Response.WriteAsync("WebSocket requests only.");
    return;
  }

  gameServer.HandleWebSocket(await context.WebSockets.AcceptWebSocketAsync());
});

app.Run();
