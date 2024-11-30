using RuleChaos.Models;
using RuleChaos.Models.GameSessions;

var builder = WebApplication.CreateBuilder(args);

var policyAllowAll = "AllowSpecificOrigin";

builder.Services.AddCors(options => options.AddPolicy(policyAllowAll, policy => policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseCors(policyAllowAll);

var gameServer = new GameServer();

app.MapGet("/sessions", (context) => context.Response.WriteAsJsonAsync(gameServer.ActiveGameSessionsDTOs));

app.MapPost("/sessions", async (context) =>
{
  var isPrivate = bool.TryParse(context.Request.Form["isPrivate"], out bool result) && result;
  var gameSession = new GameSession(isPrivate);
  gameServer.AddSession(gameSession);

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
