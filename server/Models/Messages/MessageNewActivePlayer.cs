namespace RuleChaos.Models.Messages
{
  public class MessageNewActivePlayer : Message
  {
    public string PlayerName { get; set; }

    public override string Type
    {
      get => MessageType.NewActivePlayer;
    }

    public MessageNewActivePlayer(string playerName)
    {
      this.PlayerName = playerName;
    }
  }
}
