namespace RuleChaos.Utilities
{
  public class RandomElementPicker<T>(T[] items)
  {
    private readonly T[] items = items;
    private readonly Random random = new Random();

    public T Next() => this.items[this.random.Next(this.items.Length)];
  }
}
