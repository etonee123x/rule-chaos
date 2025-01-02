import type { Player } from '@/helpers/player';
import type { WithId } from '@/types';
import type { Voting, VotingActive, VotingEnded, VotingValue } from '@/helpers/voting';

export interface Message<TType extends MessageType = MessageType> {
  type: TType;
}

export class Message<TType extends MessageType = MessageType> implements Message<TType> {
  constructor(public type: TType) {}
}

export enum MessageType {
  PlayerJoinedSession = 'PlayerJoinedSession',
  PlayerLeftSession = 'PlayerLeftSession',
  RoundWasStarted = 'RoundWasStarted',
  NewActivePlayer = 'NewActivePlayer',
  SessionInitiation = 'SessionInitiation',
  ItemsInHandUpdate = 'ItemsInHandUpdate',
  ItemsOnFieldUpdate = 'ItemsOnFieldUpdate',
  HistoryUpdate = 'HistoryUpdate',

  PlayerPlacingItem = 'PlayerPlacingItem',
  PlayerWantsToStartRound = 'PlayerWantsToStartRound',
  PlayerVotes = 'PlayerVotes',

  VotingInitiation = 'VotingInitiation',
  VotingUpdate = 'VotingUpdate',
  VotingEnd = 'VotingEnd',
}

export interface MessageTypeToMessage {
  [MessageType.NewActivePlayer]: MessageNewActivePlayer;
  [MessageType.RoundWasStarted]: MessageRoundWasStarted;
  [MessageType.PlayerJoinedSession]: MessagePlayerJoinedSession;
  [MessageType.PlayerLeftSession]: MessagePlayerLeftSession;
  [MessageType.SessionInitiation]: MessageSessionInitiation;
  [MessageType.ItemsInHandUpdate]: MessageItemsInHandUpdate;
  [MessageType.ItemsOnFieldUpdate]: MessageItemsOnFieldUpdate;
  [MessageType.HistoryUpdate]: MessageHistoryUpdate;
  [MessageType.PlayerPlacingItem]: MessagePlayerPlacingItem;
  [MessageType.PlayerWantsToStartRound]: MessagePlayerWantsToStartRound;
  [MessageType.PlayerVotes]: MessagePlayerVotes;

  [MessageType.VotingInitiation]: MessageVotingInitiation;
  [MessageType.VotingUpdate]: MessageVotingUpdate;
  [MessageType.VotingEnd]: MessageVotingEnd;
}

export interface MessagePlayerLeftSession extends Message<MessageType.PlayerLeftSession> {
  players: Array<Player>;
  player: Player;
}

export interface MessagePlayerJoinedSession extends Message<MessageType.PlayerJoinedSession> {
  players: Array<Player>;
  player: Player;
}

export interface MessageNewActivePlayer extends Message<MessageType.NewActivePlayer> {
  player: Player;
}

export interface MessageRoundWasStarted extends Message<MessageType.RoundWasStarted> {
  players: Array<Player>;
}

export interface MessageSessionInitiation extends Message<MessageType.SessionInitiation> {
  player: Player;
  sessionState: SessionState;
}

export interface MessageHistoryUpdate extends Message<MessageType.HistoryUpdate> {
  history: Array<HistoryRecord>;
}

export interface MessageItemsInHandUpdate extends Message<MessageType.ItemsInHandUpdate> {
  itemsInHand: Array<Item>;
}

export interface MessageItemsOnFieldUpdate extends Message<MessageType.ItemsOnFieldUpdate> {
  itemsOnField: Array<ItemWithPosition>;
}

export class MessagePlayerPlacingItem extends Message {
  constructor(public itemWithPosition: ItemWithPosition) {
    super(MessageType.PlayerPlacingItem);
  }
}

export class MessagePlayerWantsToStartRound extends Message<MessageType.PlayerWantsToStartRound> {
  constructor() {
    super(MessageType.PlayerWantsToStartRound);
  }
}

export class MessagePlayerVotes extends Message<MessageType.PlayerVotes> {
  constructor(public value: VotingValue) {
    super(MessageType.PlayerVotes);
  }
}

export interface MessageVotingInitiation extends Message<MessageType.VotingInitiation> {
  activeVoting: VotingActive;
}

export interface MessageVotingUpdate extends Message<MessageType.VotingUpdate> {
  activeVoting: VotingActive;
}

export interface MessageVotingEnd extends Message<MessageType.VotingEnd> {
  activeVoting: VotingEnded;
}

export interface HistoryRecord extends WithId {
  message: string;
  timestamp: string;
}

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
  isRoundActive: boolean;
  activeVoting: Voting | null;
}

export const doesMessageHasType = <Type extends MessageType>(
  message: Message,
  type: Type,
): message is MessageTypeToMessage[Type] => message.type === type;
