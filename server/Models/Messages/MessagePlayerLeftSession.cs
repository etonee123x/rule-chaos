using RuleChaos.Models.Players;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerLeftSession(PlayerDTO player, PlayerDTO[] players)
    : Message
  {
    public PlayerDTO Player { get; set; } = player;
    public PlayerDTO[] Players { get; set; } = players;

    public override string Type
    {
      get => MessageType.PlayerLeftSession;
    }
  }
}
