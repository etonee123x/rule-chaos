namespace RuleChaos.Models.Messages
{
  public class MessagePlayerJoinedSession : Message
  {
    public string PlayerName { get; set; }
    public string[] PlayersNames { get; set; }

    public override string Type
    {
      get => MessageType.PlayerJoinedSession;
    }

    public MessagePlayerJoinedSession(string playerName, string[] playersNames)
    {
      this.PlayerName = playerName;
      this.PlayersNames = playersNames;
    }
  }
}
