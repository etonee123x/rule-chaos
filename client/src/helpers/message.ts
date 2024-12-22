import type { Player } from '@/helpers/player';
import type { WithId } from '@/types';

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
  ItemsOnFieldUpdate = 'ItemsOnFieldUpdate',
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
  [MessageType.ItemsOnFieldUpdate]: MessageItemsOnFieldUpdate;
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
  itemsInHand: Array<Item>;
}

export interface MessageItemsOnFieldUpdate extends Message<MessageType.ItemsOnFieldUpdate> {
  itemsOnField: Array<ItemWithPosition>;
}

export interface MessagePlayerPlacingItem extends Message<MessageType.PlayerPlacingItem> {
  itemWithPosition: ItemWithPosition;
}

interface WithPlayer {
  player: Player;
}

interface WithPlayers {
  players: Array<Player>;
}

export interface HistoryRecord extends WithId {
  message: string;
  timestamp: string;
}

interface WithPlayerAndPlayers extends WithPlayer, WithPlayers {}

export interface Position {
  col: number;
  row: number;
}

export interface Item extends WithId {
  text: string;
  value: string;
}

export interface ItemWithPosition extends Item {
  position: Position;
}

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
