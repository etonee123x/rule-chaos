import { useContext } from 'react';
import { SessionContext } from './_context';

export { type SessionContext };

export { SessionProvider } from './Provider';

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('Нету контекста!');
  }

  return context;
};
