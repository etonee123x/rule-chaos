export enum MessageType {
  PlayerJoinedSession = 'PlayerJoinedSession',
  PlayerLeftSession = 'PlayerLeftSession',
  SessionWasStarted = 'SessionWasStarted',
  NewActivePlayer = 'NewActivePlayer',
}

export interface Message<TType extends MessageType = MessageType> {
  Type: TType;
}

export interface MessagePlayerLeftSession extends Message<MessageType.PlayerLeftSession> {
  PlayersNames: Array<string>;
  PlayerName: string;
}

export interface MessagePlayerJoinedSession extends Message<MessageType.PlayerJoinedSession> {
  PlayersNames: Array<string>;
  PlayerName: string;
}

export interface MessageNewActivePlayer extends Message<MessageType.NewActivePlayer> {
  PlayerName: string;
}

export interface MessageSessionWasStarted extends Message<MessageType.SessionWasStarted> {}

export interface MessageTypeToMessage {
  [MessageType.NewActivePlayer]: MessageNewActivePlayer;
  [MessageType.SessionWasStarted]: MessageSessionWasStarted;
  [MessageType.PlayerJoinedSession]: MessagePlayerJoinedSession;
  [MessageType.PlayerLeftSession]: MessagePlayerLeftSession;
}
