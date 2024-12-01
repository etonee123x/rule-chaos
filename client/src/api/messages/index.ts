export interface Message<TType extends MessageType = MessageType> {
  type: TType;
}

export enum MessageType {
  PlayerJoinedSession = 'PlayerJoinedSession',
  PlayerLeftSession = 'PlayerLeftSession',
  SessionWasStarted = 'SessionWasStarted',
  NewActivePlayer = 'NewActivePlayer',
  PlayerSelfIdentification = 'PlayerSelfIdentification',
  TEST_PlayerClickedButton = 'TEST_PlayerClickedButton',
}

export interface MessageTypeToMessage {
  [MessageType.NewActivePlayer]: MessageNewActivePlayer;
  [MessageType.SessionWasStarted]: MessageSessionWasStarted;
  [MessageType.PlayerJoinedSession]: MessagePlayerJoinedSession;
  [MessageType.PlayerLeftSession]: MessagePlayerLeftSession;
  [MessageType.PlayerSelfIdentification]: MessagePlayerSelfIdentification;
  [MessageType.TEST_PlayerClickedButton]: Message_TEST_PlayerClickedButton;
}

export interface MessagePlayerLeftSession extends Message<MessageType.PlayerLeftSession>, WithPlayerAndPlayers {}

export interface MessagePlayerJoinedSession extends Message<MessageType.PlayerJoinedSession>, WithPlayerAndPlayers {}

export interface MessageNewActivePlayer extends Message<MessageType.NewActivePlayer>, WithPlayer {}

export interface MessageSessionWasStarted extends Message<MessageType.SessionWasStarted> {}

export interface MessagePlayerSelfIdentification extends Message<MessageType.PlayerSelfIdentification>, WithPlayer {}

export interface Message_TEST_PlayerClickedButton extends Message<MessageType.TEST_PlayerClickedButton> {}

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
