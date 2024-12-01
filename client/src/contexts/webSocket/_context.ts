import type { Message, MessageType, MessageTypeToMessage } from '@/api/messages';
import type { Session } from '@/api/sessions';
import { createContext } from 'react';

export type Handler = (message: Message) => void | Promise<void>;

export interface WebSocketContext {
  isOpened: boolean;
  open: (sessionId: Session['id']) => void;
  close: () => void;
  addHandler: (handler: Handler) => () => void;
  send: <T extends MessageType>(type: T, message: Omit<MessageTypeToMessage[T], 'type'>) => void;
}

export const WebSocketContext = createContext<WebSocketContext | null>(null);
