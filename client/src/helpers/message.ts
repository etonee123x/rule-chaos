import type { Player } from '@/helpers/player';

export interface Message<TType extends MessageType = MessageType> {
  type: TType;
}

export enum MessageType {
  PlayerJoinedSession = 'PlayerJoinedSession',
  PlayerLeftSession = 'PlayerLeftSession',
  RoundWasStarted = 'RoundWasStarted',
  NewActivePlayer = 'NewActivePlayer',
  SessionInitialization = 'SessionInitialization',
  ItemsInHandUpdate = 'ItemsInHandUpdate',
  History = 'History',

  PlayerPlacingItem = 'PlayerPlacingItem',
}

export interface MessageTypeToMessage {
  [MessageType.NewActivePlayer]: MessageNewActivePlayer;
  [MessageType.RoundWasStarted]: MessageRoundWasStarted;
  [MessageType.PlayerJoinedSession]: MessagePlayerJoinedSession;
  [MessageType.PlayerLeftSession]: MessagePlayerLeftSession;
  [MessageType.SessionInitialization]: MessageSessionInitialization;
  [MessageType.ItemsInHandUpdate]: MessageItemsInHandUpdate;
  [MessageType.History]: MessageHistory;
  [MessageType.PlayerPlacingItem]: MessagePlayerPlacingItem;
}

export interface MessagePlayerLeftSession extends Message<MessageType.PlayerLeftSession>, WithPlayerAndPlayers {}

export interface MessagePlayerJoinedSession extends Message<MessageType.PlayerJoinedSession>, WithPlayerAndPlayers {}

export interface MessageNewActivePlayer extends Message<MessageType.NewActivePlayer>, WithPlayer {}

export interface MessageRoundWasStarted extends Message<MessageType.RoundWasStarted> {}

export interface MessageSessionInitialization extends Message<MessageType.SessionInitialization>, WithPlayer {
  sessionState: SessionState;
}

export interface MessageHistory extends Message<MessageType.History> {
  history: Array<HistoryRecord>;
}

export interface MessageItemsInHandUpdate extends Message<MessageType.ItemsInHandUpdate> {
  itemsCurrent: Array<Item>;
  itemsPrevious: Array<Item>;
}

export interface MessagePlayerPlacingItem extends Message<MessageType.PlayerPlacingItem> {
  itemOnField: ItemWithPosition;
}

interface WithPlayer {
  player: Player;
}

interface WithPlayers {
  players: Array<Player>;
}

export interface HistoryRecord {
  id: string;
  message: string;
  timestamp: string;
}

interface WithPlayerAndPlayers extends WithPlayer, WithPlayers {}

interface WithTextAndValue {
  text: string;
  value: string;
}

export interface Position {
  col: number;
  row: number;
}

interface WithPosition {
  position: Position;
}

export interface Item extends WithTextAndValue {
  category: unknown;
}

export interface ItemWithPosition extends Item, WithPosition {}

export interface SessionState {
  players: Array<Player>;
  player: Player | null;
  activePlayer: Player | null;
  itemsInHand: Array<Item>;
  itemsOnField: Array<ItemWithPosition>;
  history: Array<HistoryRecord>;
}

export const doesMessageHasType = <Type extends MessageType>(
  message: Message,
  type: Type,
): message is MessageTypeToMessage[Type] => message.type === type;
