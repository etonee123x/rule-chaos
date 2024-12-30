namespace RuleChaos.Models.Messages
{
  public static class MessageType
  {
    public const string PlayerJoinedSession = "PlayerJoinedSession";
    public const string PlayerLeftSession = "PlayerLeftSession";
    public const string RoundWasStarted = "RoundWasStarted";
    public const string NewActivePlayer = "NewActivePlayer";
    public const string SessionInitialization = "SessionInitialization";
    public const string ItemsInHandUpdate = "ItemsInHandUpdate";
    public const string ItemsOnFieldUpdate = "ItemsOnFieldUpdate";
    public const string History = "History";
    public const string PlayerPlacingItem = "PlayerPlacingItem";
    public const string Notification = "Notification";
    public const string PlayerWantsToStartRound = "PlayerWantsToStartRound";
    public const string VotingInitiated = "VotingInitiated";
    public const string VotingUpdate = "VotingUpdate";
    public const string VotingEnd = "VotingEnd";
  }
}
