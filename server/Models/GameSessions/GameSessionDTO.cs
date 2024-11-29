using RuleChaos.Models.Players;

namespace RuleChaos.Models.GameSessions
{
  public class GameSessionDTO(GameSession gameSession)
  {
    public Guid Id { get; } = gameSession.Id;
    public PlayerDTO[] Players { get; } = gameSession.PlayersDTOs;
  }
}
