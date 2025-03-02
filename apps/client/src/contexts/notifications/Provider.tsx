import { useCallback, useEffect, useMemo, useRef, useState, type FC, type PropsWithChildren } from 'react';
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

  const timeoutsRef = useRef(new Set<ReturnType<typeof setTimeout>>());

  const notify = Object.assign(
    (...[parameter]: Parameters<Notify>) => {
      const id = Date.now() + Math.random();

      const notification = {
        id,
        ...parameter,
      };

      const timeout = setTimeout(() => {
        close(notification);
        timeoutsRef.current.delete(timeout);
      }, 5000);

      timeoutsRef.current.add(timeout);

      setNotifications((notifications) => [...notifications, notification]);
    },
    {
      success: (...[parameter]: Parameters<NotifyWithKnownType>) =>
        notify({
          ...parameter,
          type: NotificationType.Success,
        }),
      info: (...[parameter]: Parameters<NotifyWithKnownType>) =>
        notify({
          ...parameter,
          type: NotificationType.Info,
        }),
      error: (...[parameter]: Parameters<NotifyWithKnownType>) =>
        notify({
          ...parameter,
          type: NotificationType.Error,
        }),
    },
  );

  const close = useCallback(
    (notification: Notification) =>
      setNotifications((notifications) =>
        notifications.filter((_notification) => _notification.id !== notification.id),
      ),
    [],
  );

  useEffect(
    () => () => {
      notifications.forEach(close);
      timeoutsRef.current.forEach(clearInterval);
      timeoutsRef.current.clear();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const notificationsContext: NotificationsContext = useMemo(
    () => ({
      notifications,
      notify,
      close,
    }),
    [notifications, notify, close],
  );

  return <NotificationsContext.Provider value={notificationsContext}>{children}</NotificationsContext.Provider>;
};
