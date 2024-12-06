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
  TEST_PlayerClickedButton = 'TEST_PlayerClickedButton',
}

export interface MessageTypeToMessage {
  [MessageType.NewActivePlayer]: MessageNewActivePlayer;
  [MessageType.RoundWasStarted]: MessageRoundWasStarted;
  [MessageType.PlayerJoinedSession]: MessagePlayerJoinedSession;
  [MessageType.PlayerLeftSession]: MessagePlayerLeftSession;
  [MessageType.PlayerSelfIdentification]: MessagePlayerSelfIdentification;
  [MessageType.TEST_PlayerClickedButton]: Message_TEST_PlayerClickedButton;
  [MessageType.ItemsUpdate]: MessageItemsUpdate;
}

export interface MessagePlayerLeftSession extends Message<MessageType.PlayerLeftSession>, WithPlayerAndPlayers {}

export interface MessagePlayerJoinedSession extends Message<MessageType.PlayerJoinedSession>, WithPlayerAndPlayers {}

export interface MessageNewActivePlayer extends Message<MessageType.NewActivePlayer>, WithPlayer {}

export interface MessageRoundWasStarted extends Message<MessageType.RoundWasStarted> {}

export interface MessagePlayerSelfIdentification extends Message<MessageType.PlayerSelfIdentification>, WithPlayer {}

export interface Message_TEST_PlayerClickedButton extends Message<MessageType.TEST_PlayerClickedButton> {}

export interface MessageItemsUpdate extends Message<MessageType.ItemsUpdate> {
  itemsCurrent: Array<Item>;
  itemsPrevious: Array<Item>;
}

export interface Player {
  name: string;
  id: string;
}

interface WithPlayer {
  player: Player;
}

interface WithPlayers {
  players: Array<Player>;
}

interface WithPlayerAndPlayers extends WithPlayer, WithPlayers {}

interface WithTextAndValue {
  text: string;
  value: string;
}

export interface Item extends WithTextAndValue {
  category: unknown;
}
