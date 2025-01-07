using RuleChaos.Models.Messages;
using RuleChaos.Models.Votings.DTOs;
using RuleChaos.Utilities;

namespace RuleChaos.Models.Votings
{
  public abstract class Voting
  {
    public List<Guid> PlayersAllowedToVoteIds { get; }
    public List<Guid> PlayersVotedPositiveIds { get; } = [];
    public List<Guid> PlayersVotedNegativeIds { get; } = [];

    public List<Guid> VotedPlayersIds
    {
      get => [.. this.PlayersVotedPositiveIds, .. this.PlayersVotedNegativeIds];
    }

    public VoteValue? Result { get; private set; }

    public abstract string Title { get; }
    public virtual TimeSpan Duration { get; init; } = TimeSpan.FromSeconds(30);

    protected int PotentialMaximumVotesNumber { get => this.PlayersAllowedToVoteIds.Count; }

    protected GameSession GameSession { get; }

    protected virtual bool ShouldEndAsPositive
    {
      get => this.PlayersVotedPositiveIds.Count > this.PlayersVotedNegativeIds.Count;
    }

    protected virtual bool ShouldEndVotingRightNow
    {
      get
      {
        var half = this.PotentialMaximumVotesNumber / 2;

        return this.PlayersVotedPositiveIds.Count > half || this.PlayersVotedNegativeIds.Count > half;
      }
    }

    private readonly Timer? timer;

    public AbsoluteTimerLimits AbsoluteTimerLimits { get; init; }

    public Voting(Player player, GameSession gameSession)
    {
      this.GameSession = gameSession;

      if (this.GameSession.ActiveVoting is not null)
      {
        throw new Exception("Уже есть активное голосование");
      }

      this.PlayersAllowedToVoteIds = this.GameSession.Players.Select((player) => player.Id).ToList();

      this.GameSession.ActiveVoting = this;

      this.AbsoluteTimerLimits = new AbsoluteTimerLimits(this.Duration);

      this.timer = new Timer(
        _ => this.End(this.ShouldEndAsPositive),
        null,
        this.Duration,
        Timeout.InfiniteTimeSpan);

      this.GameSession.SendMessageToPlayers(new MessageVotingInitiation(this));
      this.Vote(player, VoteValue.Positive);
    }

    public void Vote(Player player, VoteValue voteValue)
    {
      if (!this.PlayerIsAllowedToVote(player))
      {
        // Если нельзя ему голосовать
        return;
      }

      if (this.PlayerHasVoted(player))
      {
        // Если уже проголосовал
        return;
      }

      var isVotePositive = voteValue == VoteValue.Positive;
      var isVoteNegative = voteValue == VoteValue.Negative;

      if (!(isVotePositive || isVoteNegative))
      {
        // Если непонятно что голосует
        return;
      }

      if (isVotePositive)
      {
        this.PlayersVotedPositiveIds.Add(player.Id);
      }
      else if (isVoteNegative)
      {
        this.PlayersVotedNegativeIds.Add(player.Id);
      }

      this.GameSession.SendMessageToPlayers(new MessageVotingUpdate(this));

      if (this.ShouldEndVotingRightNow)
      {
        this.End(this.ShouldEndAsPositive);
      }
    }

    public bool PlayerIsAllowedToVote(Player player) => this.PlayersAllowedToVoteIds.Contains(player.Id);
    public bool PlayerHasVoted(Player player) => this.VotedPlayersIds.Contains(player.Id);

    public VotingDTO ToDTO() => new VotingDTO(this);

    public void End(bool isPositive)
    {
      this.timer?.Dispose();
      this.Result = isPositive ? VoteValue.Positive : VoteValue.Negative;

      this.GameSession.ActiveVoting = null;
      this.GameSession.SendMessageToPlayers(new MessageVotingEnd(this));

      if (isPositive)
      {
        this.OnPositive();
      }
    }

    protected abstract void OnPositive();
  }
}
