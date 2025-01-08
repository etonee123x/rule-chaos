namespace RuleChaos.Models.Messages
{
  public enum MessageType
  {
    RoundWasStarted,
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
