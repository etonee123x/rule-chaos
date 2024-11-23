using RuleChaos.Models.Players;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerJoinedSession(PlayerDTO player, PlayerDTO[] players)
    : MessageFromServer
  {
    public PlayerDTO Player { get; set; } = player;
    public PlayerDTO[] Players { get; set; } = players;

    public override string Type
    {
      get => MessageType.PlayerJoinedSession;
    }
  }
}
