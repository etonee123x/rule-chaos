import type { Message, MessageType, MessageTypeToMessage } from '@/api/messages';
import { createContext } from 'react';

export type Handler = (message: Message) => void | Promise<void>;

export interface WebSocketContext {
  isOpened: boolean;
  open: (playerName: string, sessionCode: string) => void;
  close: () => void;
  addHandler: (handler: Handler) => () => void;
  send: <T extends MessageType>(type: T, message: Omit<MessageTypeToMessage[T], 'Type'>) => void;
}

export const WebSocketContext = createContext<WebSocketContext | null>(null);
