import type { Message, MessageType, MessageTypeToMessage } from '@/api/messages';
import { invoke } from '@/utils/invoke';
import {
  createContext,
  useState,
  useContext,
  useEffect,
  type PropsWithChildren,
  type FC,
  useCallback,
  useRef,
} from 'react';

type Handler = (message: Message) => void | Promise<void>;

interface WebSocketContext {
  isOpened: boolean;
  open: (playerName: string, sessionCode: string) => void;
  close: () => void;
  addHandler: (handler: Handler) => () => void;
  send: <T extends MessageType>(type: T, message: Omit<MessageTypeToMessage[T], 'Type'>) => void;
}

const WebSocketContext = createContext<WebSocketContext | null>(null);

export const WebSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Set<Handler>>(new Set());

  const [isOpened, setIsOpened] = useState(false);

  const open: WebSocketContext['open'] = useCallback((playerName, sessionCode) => {
    const url = new URL('/', 'ws://localhost:8080');

    url.searchParams.append('session_code', sessionCode);
    url.searchParams.append('player_name', playerName);

    if (socketRef.current) {
      if (socketRef.current.url === url.toString()) {
        return console.warn(`Уже подключено к ${url}`);
      }

      socketRef.current.close();
    }

    const deserialize = (messageEvent: MessageEvent) => {
      const result = JSON.parse(messageEvent.data) as Message;

      // TODO: запилить обработку ошибок!

      return result;
    };

    const webSocket = new WebSocket(url);

    webSocket.onopen = () => setIsOpened(true);
    webSocket.onclose = () => setIsOpened(false);
    webSocket.onerror = (error) => console.error('Ошибка WebSocket:', error);

    webSocket.onmessage = (messageEvent) => {
      const deserializedMessage = deserialize(messageEvent);

      handlersRef.current.values().forEach(invoke(deserializedMessage));
    };

    socketRef.current = webSocket;
  }, []);

  const close = useCallback(() => {
    if (!socketRef.current) {
      return;
    }

    if (handlersRef.current.size) {
      handlersRef.current.clear();
    }

    socketRef.current.close();
  }, []);

  useEffect(() => close, [close]);

  const addHandler = useCallback<WebSocketContext['addHandler']>((handler) => {
    handlersRef.current.add(handler);

    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  const send = useCallback<WebSocketContext['send']>((type, message) => {
    const messageSerialized = JSON.stringify({
      Type: type,
      ...message,
    });

    socketRef.current?.send(messageSerialized);
  }, []);

  return (
    <WebSocketContext.Provider value={{ isOpened, open, close, addHandler, send }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('Нету контекста!');
  }

  return context;
};
