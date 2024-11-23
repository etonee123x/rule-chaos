using RuleChaos.Models.Players;

namespace RuleChaos.Models.Messages
{
  public class Message_TEST_PlayerClickedButton : MessageFromClient
  {
    public override string Type
    {
      get => MessageType.TEST_PlayerClickedButton;
    }

    public override void Handle(GameSession gameSession, Player player)
    {
      gameSession.MakeFirstOrNextPlayerActive();
    }
  }
}
