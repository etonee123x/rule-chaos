using System.Text.Json.Serialization;
using System.Threading;
using RuleChaos.Models.Messages;

namespace RuleChaos.Models.Votings
{
  public abstract class Voting
  {
    public byte PotentialMaximumVotesNumber { get; private set; }

    public List<Guid> PlayersVotedPositiveIds { get; } = [];
    public List<Guid> PlayersVotedNegativeIds { get; } = [];

    public List<Guid> VotedPlayersIds
    {
      get => [.. this.PlayersVotedPositiveIds, .. this.PlayersVotedNegativeIds];
    }

    public string? Result { get; private set; }

    public abstract string Title { get; }
    public virtual TimeSpan Duration { get; init; } = TimeSpan.FromSeconds(3000);

    public long StartedAt { get; init; }
    public long EndAt { get; init; }

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

    public Voting(Player player, GameSession gameSession)
    {
      this.GameSession = gameSession;

      if (this.GameSession.ActiveVoting is not null)
      {
        player.SendMessage(new MessageNotification("Уже есть активное голосование"));
        return;
      }

      this.PotentialMaximumVotesNumber = (byte)this.GameSession.Players.Count;

      this.GameSession.ActiveVoting = this;

      this.StartedAt = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
      this.EndAt = this.StartedAt + (long)this.Duration.TotalMilliseconds;

      this.timer = new Timer(
        _ =>
          {
            this.End(this.ShouldEndAsPositive);
            this.timer?.Dispose();
          },
        null,
        this.Duration,
        Timeout.InfiniteTimeSpan);

      this.GameSession.SendMessageToPlayers(new MessageVotingInitiation(this));
      this.Vote(player, VoteValue.Positive);
    }

    public void Vote(Player player, string voteValue)
    {
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

    public bool PlayerHasVoted(Player player) => this.VotedPlayersIds.Contains(player.Id);

    public VotingDTO ToDTO() => new VotingDTO(this);

    public void End(bool isPositive)
    {
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

  public class VotingDTO(Voting voting)
  {
    [JsonPropertyName("title")]
    public string Title { get; } = voting.Title;

    [JsonPropertyName("playersVotedPositiveIds")]
    public Guid[] PlayersVotedPositiveIds { get; } = voting.PlayersVotedPositiveIds.ToArray();

    [JsonPropertyName("playersVotedNegativeIds")]
    public Guid[] PlayersVotedNegativeIds { get; } = voting.PlayersVotedNegativeIds.ToArray();

    [JsonPropertyName("startedAt")]
    public long StartedAt { get; } = voting.StartedAt;

    [JsonPropertyName("endAt")]
    public long EndAt { get; } = voting.EndAt;
    public string? Result { get; } = voting.Result;
  }
}
