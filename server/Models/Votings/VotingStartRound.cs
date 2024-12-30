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

    protected override void Check()
    {
      if (this.VotedPlayersIds.Count < this.PotentialMaximumVotesNumber)
      {
        return;
      }

      this.End(true);
    }

    protected override void OnPositive()
    {
      this.GameSession.StartRound(this.PlayersVotedPositiveIds);
    }
  }
}
