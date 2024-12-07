import { useCallback, useEffect, useMemo, useRef, type FC, type PropsWithChildren } from 'react';
import { WebSocketContext, type Handler, type WebSocketEventType } from './_context';
import { invoke } from '@/utils/invoke';
import type { Message } from '@/api/messages';

const messageEventToMessage = (messageEvent: MessageEvent) => {
  const result = JSON.parse(messageEvent.data) as Message;

  // TODO: запилить обработку ошибок!

  return result;
};

const getInitialEventListenersValue = () => ({
  message: new Set<Handler<'message'>>(),
  _messageRaw: new Set<Handler<'_messageRaw'>>(),
  close: new Set<Handler<'close'>>(),
  error: new Set<Handler<'error'>>(),
  open: new Set<Handler<'open'>>(),
});

export const WebSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const eventListenersRef = useRef(getInitialEventListenersValue());

  const isOpened = useMemo(() => Boolean(socketRef.current), []);

  const close = useCallback(() => {
    if (!socketRef.current) {
      return;
    }

    eventListenersRef.current = getInitialEventListenersValue();

    socketRef.current.close();
    socketRef.current = null;
  }, []);

  const open: WebSocketContext['open'] = useCallback(
    (sessionId) => {
      const url = new URL('/ws', import.meta.env.VITE_API_URL_WS);

      url.searchParams.append('session_id', sessionId);

      if (socketRef.current) {
        if (socketRef.current.url === url.toString()) {
          return console.warn(`Уже подключено к ${url}`);
        }

        socketRef.current.close();
      }

      const webSocket = new WebSocket(url);

      webSocket.onmessage = (messageEvent) => {
        eventListenersRef.current._messageRaw.values().forEach(invoke(messageEvent));
        eventListenersRef.current.message.values().forEach(invoke(messageEventToMessage(messageEvent)));
      };

      webSocket.onerror = (event) => {
        eventListenersRef.current.error.values().forEach(invoke(event));
        console.error('Ошибка WebSocket:', event);
      };

      webSocket.onclose = (event) => {
        eventListenersRef.current.close.values().forEach(invoke(event));
        close();
      };

      webSocket.onopen = (event) => {
        eventListenersRef.current.open.values().forEach(invoke(event));
        socketRef.current = webSocket;
      };
    },
    [close],
  );

  useEffect(() => close, [close]);

  const send = useCallback<WebSocketContext['send']>((type, message) => {
    const messageSerialized = JSON.stringify({
      ...message,
      type,
    });

    socketRef.current?.send(messageSerialized);
  }, []);

  const addEventListener: WebSocketContext['addEventListener'] = useCallback(
    <Type extends WebSocketEventType>(type: Type, handler: Handler<Type>) => {
      const theSet = eventListenersRef.current[type] as Set<Handler<Type>>;

      theSet.add(handler);

      return () => void theSet.delete(handler);
    },
    [],
  );

  return (
    <WebSocketContext.Provider value={{ isOpened, open, close, addEventListener, send }}>
      {children}
    </WebSocketContext.Provider>
  );
};
