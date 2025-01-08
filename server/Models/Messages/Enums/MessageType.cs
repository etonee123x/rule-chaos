namespace RuleChaos.Models.Messages
{
  public enum MessageType
  {
    RoundWasStarted,
    PlayerInitiation,
    SessionInitiation,
    ItemsInHandUpdate,
    ItemsOnFieldUpdate,
    HistoryUpdate,
    PlayerPlacingItem,
    Notification,
    PlayerWantsToStartRound,
    VotingInitiation,
    VotingUpdate,
    VotingEnd,
    PlayerVotes,
    PlayersUpdate,
  }
}
