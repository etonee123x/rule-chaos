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
    public virtual TimeSpan Timeout { get; init; } = TimeSpan.FromSeconds(30);

    protected GameSession GameSession { get; }

    private bool HasMoreThanHalfVotesOfOneType
    {
      get
      {
        var half = this.PotentialMaximumVotesNumber / 2;

        return this.PlayersVotedPositiveIds.Count > half || this.PlayersVotedNegativeIds.Count > half;
      }
    }

    private bool HasMorePositive
    {
      get
      {
        return this.PlayersVotedPositiveIds.Count > this.PlayersVotedNegativeIds.Count;
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

      this.PotentialMaximumVotesNumber = (byte)this.GameSession.PlayersInSession.Count;

      this.GameSession.ActiveVoting = this;

      this.timer = new Timer(
        _ =>
          {
            this.End(this.HasMorePositive);
            this.timer?.Dispose();
          },
        null,
        this.Timeout,
        System.Threading.Timeout.InfiniteTimeSpan);

      this.GameSession.SendMessageToPlayers(new MessageVotingInitiated(this));
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

      this.Check();
    }

    public bool PlayerHasVoted(Player player)
    {
      return this.VotedPlayersIds.Contains(player.Id);
    }

    public VotingDTO ToDTO()
    {
      return new VotingDTO(this);
    }

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

    protected virtual void Check()
    {
      if (!this.HasMoreThanHalfVotesOfOneType)
      {
        return;
      }

      this.End(this.HasMorePositive);
    }

    protected abstract void OnPositive();
  }

  public class VotingDTO(Voting voting)
  {
    [JsonPropertyName("title")]
    public string Title { get; } = voting.Title;

    [JsonPropertyName("votesNumberPositive")]
    public byte VotesNumberPositive { get; } = (byte)voting.PlayersVotedPositiveIds.Count;

    [JsonPropertyName("votesNumberNegative")]
    public byte VotesNumberNegative { get; } = (byte)voting.PlayersVotedNegativeIds.Count;

    [JsonPropertyName("totalTimeout")]
    public uint TotalTimeout { get; } = (uint)voting.Timeout.TotalMilliseconds;

    [JsonPropertyName("result")]
    public string? Result { get; } = voting.Result;
  }
}
