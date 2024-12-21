namespace RuleChaos.Models.Messages
{
  public static class MessageType
  {
    public const string PlayerJoinedSession = "PlayerJoinedSession";
    public const string PlayerLeftSession = "PlayerLeftSession";
    public const string RoundWasStarted = "RoundWasStarted";
    public const string NewActivePlayer = "NewActivePlayer";
    public const string SessionInitialization = "SessionInitialization";
    public const string ItemsUpdate = "ItemsUpdate";
    public const string History = "History";
    public const string PlayerPlacingItem = "PlayerPlacingItem";
  }
}
