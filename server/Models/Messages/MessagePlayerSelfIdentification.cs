using RuleChaos.Models.Players;

namespace RuleChaos.Models.Messages
{
  public class MessagePlayerSelfIdentification(PlayerDTO playerDTO)
    : MessageFromServer
  {
    public PlayerDTO Player { get; set; } = playerDTO;

    public override string Type
    {
      get => MessageType.PlayerSelfIdentification;
    }
  }
}
