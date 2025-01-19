using RuleChaos.Models;

var builder = WebApplication.CreateBuilder(args);

var policyAllowAll = "AllowSpecificOrigin";

builder.Services.AddCors(options => options.AddPolicy(policyAllowAll, policy => policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseCors(policyAllowAll);

var gameServer = new GameServer();

app.MapGet("/sessions", (context) => context.Response.WriteAsJsonAsync(gameServer.ActiveGameSessionsDTOs));

app.MapPost("/sessions", async (context) =>
{
  var isPrivate = bool.TryParse(context.Request.Form["isPrivate"], out bool isPrivateResult) && isPrivateResult;

  TimeSpan? turnDuration =
    bool.TryParse(context.Request.Form["hasTurnTimeLimit"], out bool hasTurnTimeLimitResult)
    && hasTurnTimeLimitResult
    && uint.TryParse(context.Request.Form["turnTimeLimit"], out uint turnTimeLimitResult)
      ? TimeSpan.FromSeconds(turnTimeLimitResult)
      : null;

  int maxPlayersNumber = int.TryParse(context.Request.Form["maxPlayersNumber"], out int parsedMaxPlayersNumber)
    ? parsedMaxPlayersNumber
    : GameSession.DefaultMaxPlayersNumber;
  int itemsPerPlayer = int.TryParse(context.Request.Form["itemsPerPlayer"], out int parsedItemsPerPlayer)
    ? parsedItemsPerPlayer
    : GameSession.DefaultItemsPerPlayer;

  var gameSession = new GameSession()
  {
    IsPrivate = isPrivate,
    TurnDuration = turnDuration,
    ItemsPerPlayer = itemsPerPlayer,
    MaxPlayersNumber = maxPlayersNumber,
  };

  gameServer.AddSession(gameSession);

  await context.Response.WriteAsJsonAsync(gameSession.ToListingDTO());
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

  string? maybeSessionId = context.Request.Query["session_id"];

  if (maybeSessionId == null)
  {
    context.Response.StatusCode = StatusCodes.Status400BadRequest;
    await context.Response.WriteAsync("Session id is required.");
    return;
  }

  if (!Guid.TryParse(maybeSessionId, out Guid sessionId))
  {
    context.Response.StatusCode = StatusCodes.Status400BadRequest;
    await context.Response.WriteAsync("Invalid session id format.");
    return;
  }

  await gameServer.HandleConnectionAttempt(sessionId, context);
});

app.Run();
