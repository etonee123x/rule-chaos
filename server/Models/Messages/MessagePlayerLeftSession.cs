namespace RuleChaos.Models.Messages
{
  public class MessagePlayerLeftSession : Message
  {
    public string PlayerName { get; set; }
    public string[] PlayersNames { get; set; }

    public override string Type
    {
      get => MessageType.PlayerLeftSession;
    }

    public MessagePlayerLeftSession(string playerName, string[] playersNames)
    {
      this.PlayerName = playerName;
      this.PlayersNames = playersNames;
    }
  }
}
