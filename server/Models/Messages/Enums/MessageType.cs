namespace RuleChaos.Models.Messages
{
  public enum MessageType
  {
    RoundUpdate,
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
