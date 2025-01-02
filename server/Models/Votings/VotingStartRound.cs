namespace RuleChaos.Models.Votings
{
  public class VotingStartRound : Voting
  {
    public override string Title
    {
      get => "О начале раунда";
    }

    public VotingStartRound(Player player, GameSession gameSession)
      : base(player, gameSession)
    {
    }

    protected override bool ShouldEndAsPositive
    {
      get => this.PlayersVotedPositiveIds.Count > 1;
    }

    protected override bool ShouldEndVotingRightNow
    {
      get => this.VotedPlayersIds.Count == this.PotentialMaximumVotesNumber;
    }

    protected override void OnPositive()
    {
      this.GameSession.StartRound(this.PlayersVotedPositiveIds);
    }
  }
}
