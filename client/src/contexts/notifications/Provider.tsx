import { useMemo, useState, type FC, type PropsWithChildren } from 'react';
import {
  NotificationsContext,
  NotificationType,
  type Notification,
  type Notify,
  type NotifyWithKnownType,
} from './_context';

interface Props extends PropsWithChildren {}

export const NotificationsProvider: FC<Props> = ({ children }) => {
  const [notifications, setNotifications] = useState<Array<Notification>>([]);

  const notify = Object.assign(
    (...[parameter]: Parameters<Notify>) => {
      const id = Date.now() + Math.random();

      const notification = {
        id,
        ...parameter,
      };

      setNotifications((notifications) => [...notifications, notification]);
    },
    {
      success: (...[parameter]: Parameters<NotifyWithKnownType>) =>
        notify({ ...parameter, type: NotificationType.Success }),
      info: (...[parameter]: Parameters<NotifyWithKnownType>) =>
        notify({ ...parameter, type: NotificationType.Success }),
      error: (...[parameter]: Parameters<NotifyWithKnownType>) =>
        notify({ ...parameter, type: NotificationType.Success }),
    },
  );

  const notificationsContext: NotificationsContext = useMemo(
    () => ({
      notifications,
      notify,
    }),
    [notifications, notify],
  );

  return <NotificationsContext.Provider value={notificationsContext}>{children}</NotificationsContext.Provider>;
};
