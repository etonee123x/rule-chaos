namespace RuleChaos.Models.Messages
{
  public class MessageSessionWasStarted()
    : MessageFromServer
  {
    public override string Type
    {
      get => MessageType.SessionWasStarted;
    }
  }
}
