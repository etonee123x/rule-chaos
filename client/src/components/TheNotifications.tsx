import { useNotifications } from '@/contexts/notifications';

export const TheNotifications = () => {
  const { notifications } = useNotifications();

  return (
    <div>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <pre>{JSON.stringify(notification)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};
