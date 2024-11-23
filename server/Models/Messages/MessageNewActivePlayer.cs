using RuleChaos.Models.Players;

namespace RuleChaos.Models.Messages
{
  public class MessageNewActivePlayer(PlayerDTO player)
    : MessageFromServer
  {
    public PlayerDTO Player { get; set; } = player;

    public override string Type
    {
      get => MessageType.NewActivePlayer;
    }
  }
}
