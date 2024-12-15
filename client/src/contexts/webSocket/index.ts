import { useContext } from 'react';
import { WebSocketContext } from './_context';

export { type WebSocketContext };

export { WebSocketProvider } from './Provider';

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('Нету контекста!');
  }

  return context;
};
