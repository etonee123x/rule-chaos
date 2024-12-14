import type { Player } from '@/helpers/player';

export interface Message<TType extends MessageType = MessageType> {
  type: TType;
}

export enum MessageType {
  PlayerJoinedSession = 'PlayerJoinedSession',
  PlayerLeftSession = 'PlayerLeftSession',
  RoundWasStarted = 'RoundWasStarted',
  NewActivePlayer = 'NewActivePlayer',
  PlayerSelfIdentification = 'PlayerSelfIdentification',
  ItemsUpdate = 'ItemsUpdate',
  History = 'History',
}

export interface MessageTypeToMessage {
  [MessageType.NewActivePlayer]: MessageNewActivePlayer;
  [MessageType.RoundWasStarted]: MessageRoundWasStarted;
  [MessageType.PlayerJoinedSession]: MessagePlayerJoinedSession;
  [MessageType.PlayerLeftSession]: MessagePlayerLeftSession;
  [MessageType.PlayerSelfIdentification]: MessagePlayerSelfIdentification;
  [MessageType.ItemsUpdate]: MessageItemsUpdate;
  [MessageType.History]: MessageHistory;
}

export interface MessagePlayerLeftSession extends Message<MessageType.PlayerLeftSession>, WithPlayerAndPlayers {}

export interface MessagePlayerJoinedSession extends Message<MessageType.PlayerJoinedSession>, WithPlayerAndPlayers {}

export interface MessageNewActivePlayer extends Message<MessageType.NewActivePlayer>, WithPlayer {}

export interface MessageRoundWasStarted extends Message<MessageType.RoundWasStarted> {}

export interface MessagePlayerSelfIdentification extends Message<MessageType.PlayerSelfIdentification>, WithPlayer {}

export interface MessageHistory extends Message<MessageType.History> {
  history: History;
}

export interface MessageItemsUpdate extends Message<MessageType.ItemsUpdate> {
  itemsCurrent: Array<Item>;
  itemsPrevious: Array<Item>;
}

interface WithPlayer {
  player: Player;
}

interface WithPlayers {
  players: Array<Player>;
}

export type History = Array<string>;

interface WithPlayerAndPlayers extends WithPlayer, WithPlayers {}

interface WithTextAndValue {
  text: string;
  value: string;
}

export interface Item extends WithTextAndValue {
  category: unknown;
}

export const doesMessageHasType = <Type extends MessageType>(
  message: Message,
  type: Type,
): message is MessageTypeToMessage[Type] => message.type === type;
