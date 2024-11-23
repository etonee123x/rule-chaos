export interface Message<TType extends MessageType = MessageType> {
  Type: TType;
}

export enum MessageType {
  PlayerJoinedSession = 'PlayerJoinedSession',
  PlayerLeftSession = 'PlayerLeftSession',
  SessionWasStarted = 'SessionWasStarted',
  NewActivePlayer = 'NewActivePlayer',
  PlayerSelfIdentification = 'PlayerSelfIdentification',
}

export interface MessageTypeToMessage {
  [MessageType.NewActivePlayer]: MessageNewActivePlayer;
  [MessageType.SessionWasStarted]: MessageSessionWasStarted;
  [MessageType.PlayerJoinedSession]: MessagePlayerJoinedSession;
  [MessageType.PlayerLeftSession]: MessagePlayerLeftSession;
  [MessageType.PlayerSelfIdentification]: MessagePlayerSelfIdentification;
}

export interface MessagePlayerLeftSession extends Message<MessageType.PlayerLeftSession>, WithPlayerAndPlayers {}

export interface MessagePlayerJoinedSession extends Message<MessageType.PlayerJoinedSession>, WithPlayerAndPlayers {}

export interface MessageNewActivePlayer extends Message<MessageType.NewActivePlayer>, WithPlayer {}

export interface MessageSessionWasStarted extends Message<MessageType.SessionWasStarted> {}

export interface MessagePlayerSelfIdentification extends Message<MessageType.PlayerSelfIdentification>, WithPlayer {}

export interface Player {
  Name: string;
  Id: string;
}

interface WithPlayer {
  Player: Player;
}

interface WithPlayers {
  Players: Array<Player>;
}

interface WithPlayerAndPlayers extends WithPlayer, WithPlayers {}
