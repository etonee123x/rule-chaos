using System.Runtime.Serialization;

namespace RuleChaos.Models.Messages
{
  public enum MessageType
  {
    PlayerJoinedSession,
    PlayerLeftSession,
    RoundWasStarted,
    NewActivePlayer,
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
  }
}
