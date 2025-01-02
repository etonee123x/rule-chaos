using System.Text.Json;
using System.Text.Json.Serialization;

namespace RuleChaos.Models.Messages
{
  public abstract class Message
  {
    [JsonPropertyName("type")]
    public abstract string Type { get; }

    public override string ToString() => JsonSerializer.Serialize(this, this.GetType());
  }

  public abstract class MessageFromClient : Message
  {
    public abstract void Handle(GameSession gameSession, Player player);

    public static readonly Dictionary<string, Type> MessageTypeToMessage = new Dictionary<string, Type>()
    {
      { MessageType.PlayerPlacingItem, typeof(MessagePlayerPlacingItem) },
      { MessageType.PlayerWantsToStartRound, typeof(MessagePlayerWantsToStartRound) },
      { MessageType.PlayerVotes, typeof(MessagePlayerVotes) },
    };
  }

  public abstract class MessageFromServer : Message
  {
    public abstract HistoryRecord? HistoryRecord { get; }
  }
}
