import type { Player } from '@/helpers/player';
import type { WithId } from '@/types';
import type { Voting, VotingActive, VotingEnded, VotingValue } from '@/helpers/voting';
import type { TimerLimits } from '@/helpers/timerLimits';
import type { NotificationType } from '@/contexts/notifications/_context';

export interface Message<TType extends MessageType = MessageType> {
  type: TType;
}

export class Message<TType extends MessageType = MessageType> implements Message<TType> {
  constructor(public type: TType) {}
}

export enum MessageType {
  PlayersUpdate = 'PlayersUpdate',
  RoundWasStarted = 'RoundWasStarted',
  PlayerInitiation = 'PlayerInitiation',
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

  Notification = 'Notification',
}

export interface MessageTypeToMessage {
  [MessageType.PlayersUpdate]: MessagePlayersUpdate;
  [MessageType.RoundWasStarted]: MessageRoundWasStarted;
  [MessageType.PlayerInitiation]: MessagePlayerInitiation;
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

  [MessageType.Notification]: MessageNotification;
}

export interface MessagePlayersUpdate extends Message<MessageType.PlayersUpdate> {
  players: Array<Player>;
  turnTimerLimits: TimerLimits | null;
}

export interface MessageRoundWasStarted extends Message<MessageType.RoundWasStarted> {
  players: Array<Player>;
}

export interface MessageSessionInitiation extends Message<MessageType.SessionInitiation> {
  gameSession: GameSession;
}

export interface MessagePlayerInitiation extends Message<MessageType.PlayerInitiation> {
  thePlayer: Player;
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

export interface MessageNotification extends Message<MessageType.Notification> {
  title: string;
  notificationType: NotificationType;
  description?: string;
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

export interface GameSession {
  players: Array<Player>;
  itemsInHand: Array<Item>;
  itemsOnField: Array<ItemWithPosition>;
  history: Array<HistoryRecord>;
  isRoundActive: boolean;
  activeVoting: Voting | null;
  turnTimerLimits: TimerLimits | null;
}

export const doesMessageHasType = <Type extends MessageType>(
  message: Message,
  type: Type,
): message is MessageTypeToMessage[Type] => message.type === type;
