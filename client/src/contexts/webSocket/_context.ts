import type { Message } from '@/helpers/message';
import type { Session } from '@/api/sessions';
import { createContext } from 'react';

interface WebSocketEventTypeToEvent {
  message: Message;
  _messageRaw: MessageEvent;
  close: CloseEvent;
  error: Event;
  open: Event;
}

export type WebSocketEventType = keyof WebSocketEventTypeToEvent;

export type Handler<Type extends WebSocketEventType> = (event: WebSocketEventTypeToEvent[Type]) => void;

export interface WebSocketContext {
  isOpened: boolean;
  open: (sessionId: Session['id']) => void;
  close: () => void;
  addEventListener: <Type extends WebSocketEventType>(type: Type, handler: Handler<Type>) => () => void;
  send(message: Message): void;
}

export const WebSocketContext = createContext<WebSocketContext | null>(null);
