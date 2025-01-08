using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using RuleChaos.Models.DTOs;
using RuleChaos.Models.Messages;
using RuleChaos.Models.Votings;
using RuleChaos.Utilities;

namespace RuleChaos.Models
{
  public class GameSession
  {
    public GameSession(bool isPrivate, TimeSpan? turnDuration)
    {
      this.IsPrivate = isPrivate;
      this.TurnDuration = turnDuration;

      Task.Run(async () =>
      {
        this.ItemGenerator = await ItemGenerator.CreateInstanse();
      });
    }

    public Guid Id { get; } = Guid.NewGuid();
    public bool IsPrivate { get; }
    private TimeSpan? TurnDuration { get; }
    private Timer? turnTimer;

    public bool HasEnoughPlayers { get => this.Players.Count == GameSession.PlayersNumber; }

    public Player? ActivePlayer { get => this.Players.Find((player) => player.IsActive); }
    public TimerLimits? TurnTimerLimits { get; private set; }

    private static readonly byte PlayersNumber = 4;
    private static readonly byte ItemsPerPlayer = 8;
    private static readonly byte HistoryRecordsCount = 50;

    public List<Player> Players { get; } = [];
    public List<Player> PlayersInRound
    {
      get => this.Players.Where(player => player.IsInRound).ToList();
    }

    public List<ItemWithPosition> ItemsOnField { get; } = [];
    public List<Item> ItemsInHand { get; } = [];

    public bool IsRoundActive { get; set; }

    public Voting? ActiveVoting { get; set; }

    public List<HistoryRecord> History { get; } = [];

    private DateTime lastActivity = DateTime.UtcNow;

    private ItemGenerator? ItemGenerator { get; set; }

    private static readonly RandomElementPicker<string> ElementPickerSkipTurnReasons = new RandomElementPicker<string>([
      "забыл, что его ход",
      "немного отвлёкся",
      "задумался и потерял время",
      "не успел сообразить, что нужно сделать",
      "слишком долго думал",
      "немного растерялся",
    ]);

    public GameSessionListingDTO ToListingDTO() => new GameSessionListingDTO()
    {
      Id = this.Id,
      Players = this.Players.Select((player) => player.ToDTO()).ToArray(),
      TurnDuration = this.TurnDuration,
    };

    public GameSessionDTO ToDTO() => new GameSessionDTO()
    {
      Players = this.Players.Select((player) => player.ToDTO()).ToArray(),
      ItemsInHand = this.ItemsInHand.Select((itemInHand) => itemInHand.ToDTO()).ToArray(),
      ItemsOnField = this.ItemsOnField.Select((itemOnField) => itemOnField.ToDTO()).ToArray(),
      History = this.History.Select((historyRecord) => historyRecord.ToDTO()).ToArray(),
      IsRoundActive = this.IsRoundActive,
      ActiveVoting = this.ActiveVoting?.ToDTO(),
      TurnTimerLimits = this.TurnTimerLimits?.ToDTO(),
    };

    public Task HandlePlayer(Player player)
    {
      this.AddPlayer(player);

      return Task.Run(async () =>
      {
        var buffer = new byte[1024 * 4];

        while (player.WebSocket.State == WebSocketState.Open)
        {
          var result = await player.WebSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

          var serializedMessage = Encoding.UTF8.GetString(buffer, 0, result.Count);

          if (result.MessageType == WebSocketMessageType.Close)
          {
            await player.WebSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
            break;
          }

          this.UpdateActivity();

          this.HandlePlayerMessage(player, serializedMessage);
        }

        player.OnDisconnect();
      });
    }

    public void MakeFirstOrNextPlayerActive()
    {
      try
      {
        if (this.PlayersInRound.Count == 0)
        {
          throw new Exception("В раунде нет игроков");
        }

        void MakePlayerActive(Player player)
        {
          player.IsActive = true;

          if (this.TurnDuration is null)
          {
            return;
          }

          this.TurnTimerLimits = new TimerLimits(this.TurnDuration.Value);
        }

        if (this.TurnDuration is not null)
        {
          this.turnTimer?.Dispose();
          this.turnTimer = new Timer(
            _ =>
            {
              if (this.PlayersInRound.Count == 0)
              {
                this.turnTimer?.Dispose();
                return;
              }

              if (this.ActivePlayer is not null)
              {
                this.ActivePlayer.SendMessage(new MessageNotification(NotificationType.Info, "Твой ход перешёл следующему игроку"));
                this.AddHistoryRecord(new HistoryRecord($"Игрок {HistoryRecord.Accent(this.ActivePlayer)} {GameSession.ElementPickerSkipTurnReasons.Next()}. Ход переходит к следующему игроку."));
              }

              this.MakeFirstOrNextPlayerActive();
              this.SendMessageToPlayers(new MessagePlayersUpdate(this.Players, this.TurnTimerLimits));
              if (this.ActivePlayer is null)
              {
                return;
              }

              this.AddHistoryRecord(new HistoryRecord($"Ход игрока {HistoryRecord.Accent(this.ActivePlayer)}."));
            },
            null,
            this.TurnDuration.Value,
            Timeout.InfiniteTimeSpan);
        }

        if (this.ActivePlayer is null)
        {
          MakePlayerActive(this.PlayersInRound[0]);
          return;
        }

        var index = this.PlayersInRound.IndexOf(this.ActivePlayer);

        if (index == -1)
        {
          throw new Exception($"Не найден игрок с  id {this.ActivePlayer.Id}");
        }

        this.PlayersInRound[index].IsActive = false;

        MakePlayerActive(this.PlayersInRound[(index + 1) % this.PlayersInRound.Count]);
        return;
      }
      catch (Exception exception)
      {
        this.Log(exception);
      }
    }

    public void PlaceItem(Player player, ItemWithPosition itemWithPosition)
    {
      if (!this.IsThisPlayerActive(player))
      {
        // Ходит не в свой ход
        return;
      }

      if (this.IsPositionOccupied(itemWithPosition.Position))
      {
        // На этой позиции уже что то есть
        return;
      }

      var itemInHand = this.FindItemInHand(itemWithPosition);

      if (itemInHand is null)
      {
        // Нет такого предмета
        return;
      }

      this.ItemsOnField.Add(itemWithPosition);
      this.SendMessageToPlayers(new MessageItemsOnFieldUpdate(this.ItemsOnField));
      this.AddHistoryRecord(new HistoryRecord($"Предмет {HistoryRecord.Accent(itemWithPosition.Text)} выставлен на поле ({itemWithPosition.Position})."));

      this.ItemsInHand.Remove(itemInHand);
      this.SendMessageToPlayers(new MessageItemsInHandUpdate(this.ItemsInHand));

      this.MakeFirstOrNextPlayerActive();
      this.SendMessageToPlayers(new MessagePlayersUpdate(this.Players, this.TurnTimerLimits));
      if (this.ActivePlayer is not null)
      {
        this.AddHistoryRecord(new HistoryRecord($"Ход игрока {HistoryRecord.Accent(this.ActivePlayer)}."));
      }
    }

    public bool IsInactive(TimeSpan timeSpan) => DateTime.UtcNow - this.lastActivity > timeSpan;

    public void SendMessageToPlayers(MessageFromServer message) => this.Players.ForEach((player) => player.SendMessage(message));

    public void StartRound(List<Guid> playersIds)
    {
      playersIds.ForEach(playerId =>
      {
        var maybePlayer = this.Players.Find(player => player.Id.Equals(playerId));

        if (maybePlayer is null)
        {
          return;
        }

        maybePlayer.IsInRound = true;
      });

      this.IsRoundActive = true;
      this.SendMessageToPlayers(new MessageRoundWasStarted(this.PlayersInRound));
      this.AddHistoryRecord(new HistoryRecord("Раунд начался!"));

      if (this.ItemGenerator is null)
      {
        throw new Exception("Has no item generator");
      }

      for (var i = 0; i < this.PlayersInRound.Count * GameSession.ItemsPerPlayer; i++)
      {
        this.ItemsInHand.Add(this.ItemGenerator.Next());
      }

      this.SendMessageToPlayers(new MessageItemsInHandUpdate(this.ItemsInHand));

      this.MakeFirstOrNextPlayerActive();
      this.SendMessageToPlayers(new MessagePlayersUpdate(this.Players, this.TurnTimerLimits));
      if (this.ActivePlayer is null)
      {
        return;
      }

      this.AddHistoryRecord(new HistoryRecord($"Ход игрока {HistoryRecord.Accent(this.ActivePlayer)}."));
    }

    public void AddHistoryRecord(HistoryRecord historyRecord)
    {
      this.History.Add(historyRecord);

      if (this.History.Count > GameSession.HistoryRecordsCount)
      {
        this.History.RemoveRange(0, this.History.Count - GameSession.HistoryRecordsCount);
      }

      this.SendMessageToPlayers(new MessageHistoryUpdate(this.History));
    }

    private void HandlePlayerMessage(Player player, string serializedMessage)
    {
      if (!(Enum.TryParse(JsonDocument.Parse(serializedMessage).RootElement.GetProperty("type").GetString(), out MessageType messageType)
        && Enum.IsDefined(messageType)
        && MessageFromClient.MessageTypeToMessage.TryGetValue(messageType, out var message)))
      {
        return;
      }

      ((MessageFromClient?)JsonSerializer.Deserialize(serializedMessage, message))?.Handle(this, player);
    }

    private void AddPlayer(Player player)
    {
      try
      {
        if (this.Players.Count >= GameSession.PlayersNumber)
        {
          throw new Exception($"{this.Players.Count} игроков из ${GameSession.PlayersNumber}");
        }

        this.Players.Add(player);
        this.SendMessageToPlayers(new MessagePlayersUpdate(this.Players, this.TurnTimerLimits));
        this.AddHistoryRecord(new HistoryRecord($"Игрок {HistoryRecord.Accent(player)} подключился к сессии."));
      }
      catch (Exception exception)
      {
        this.Log(exception);
      }
    }

    private bool IsThisPlayerActive(Player player) => player == this.ActivePlayer;

    private bool IsPositionOccupied(Position position) => this.ItemsOnField.Any((itemOnField) => itemOnField.Position.Equals(position));

    private Item? FindItemInHand(Item item) => this.ItemsInHand.Find((itemInHand) => itemInHand.Equals(item));

    private void Log(params object[] args)
    {
      Console.WriteLine(string.Join(' ', args));
    }

    private void UpdateActivity()
    {
      this.lastActivity = DateTime.UtcNow;
    }
  }
}
