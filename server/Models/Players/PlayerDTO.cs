namespace RuleChaos.Models.Players
{
  public class PlayerDTO(Player player)
  {
    public Guid Id { get; } = player.Id;
    public string Name { get; } = player.Name;
  }
}
