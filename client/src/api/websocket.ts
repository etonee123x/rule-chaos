import { invoke } from '@/utils/invoke';
import { type Message } from './messages';

export let webSocket: WebSocket | null;

type Handler = (message: Message) => void | Promise<void>;

const handlers = new Set<Handler>();

const deserialize = (messageEvent: MessageEvent) => {
  const result = JSON.parse(messageEvent.data) as Message;

  // TODO: запилить обработку ошибок!

  return result;
};

export const open = (sessionCode: string, playerName: string) =>
  new Promise<void>((resolve, reject) => {
    const url = new URL('/', 'ws://localhost:8080');

    url.searchParams.append('session_code', sessionCode);
    url.searchParams.append('player_name', playerName);

    if (isOpened() && webSocket?.url === url.toString()) {
      return resolve();
    }

    webSocket = new WebSocket(url);

    webSocket.onclose = reject;
    webSocket.onerror = reject;
    webSocket.onmessage = (messageEvent) => {
      const deserializedMessage = deserialize(messageEvent);

      handlers.values().forEach(invoke(deserializedMessage));
    };
    webSocket.onopen = () => resolve();
  });

export const isOpened = () => Boolean(webSocket) && webSocket?.readyState === WebSocket.OPEN;

export const close = () => {
  if (webSocket) {
    webSocket.close();
  }

  webSocket = null;
};

export const addHandler = (handler: Handler) => {
  handlers.add(handler);

  return () => {
    handlers.delete(handler);
  };
};
