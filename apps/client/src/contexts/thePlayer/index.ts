import { useContext } from 'react';
import { ThePlayerContext } from './_context';

export { type ThePlayerContext };

export { ThePlayerProvider } from './Provider';

export const useThePlayer = () => {
  const context = useContext(ThePlayerContext);

  if (!context) {
    throw new Error('Нету контекста!');
  }

  return context;
};
