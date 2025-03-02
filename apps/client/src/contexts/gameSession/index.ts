import { useContext } from 'react';
import { GameSessionContext } from './_context';

export { type GameSessionContext };

export { GameSessionProvider } from './Provider';

export const useGameSession = () => {
  const context = useContext(GameSessionContext);

  if (!context) {
    throw new Error('Нету контекста!');
  }

  return context;
};
