import { useContext } from 'react';
import { NotificationsContext } from './_context';

export { type NotificationsContext };

export { NotificationsProvider } from './Provider';

export const useNotifications = () => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error('Нету контекста!');
  }

  return context;
};
