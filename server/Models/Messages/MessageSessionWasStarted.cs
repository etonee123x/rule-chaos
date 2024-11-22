namespace RuleChaos.Models.Messages
{
  public class MessageSessionWasStarted : Message
  {
    public override string Type
    {
      get => MessageType.SessionWasStarted;
    }

    public MessageSessionWasStarted()
    {
    }
  }
}
