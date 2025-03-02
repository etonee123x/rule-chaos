import { useNotifications } from '@/contexts/notifications';
import { NotificationType, type Notification } from '@/contexts/notifications/_context';
import { checkExhaustive } from '@/utils/checkExhaustive';
import classNames from 'classnames';
import { BaseIcon } from '@/components/ui/BaseIcon';
import { mdiClose } from '@mdi/js';

const MAX_NOTIFICATION_NUMBER_TO_RENDER = 3;

export const TheNotifications = () => {
  const { notifications, close } = useNotifications();

  const notificationToClassName = (notification: Notification) => {
    switch (notification.type) {
      case NotificationType.Error:
        return 'border-red-500';
      case NotificationType.Info:
        return 'border-blue-500';
      case NotificationType.Success:
        return 'border-green-500';
      default:
        throw checkExhaustive(notification.type);
    }
  };

  const onClickClose = close;

  return (
    notifications.length > 0 && (
      <ul className="fixed z-100 end-4 bottom-4 w-120 flex flex-col gap-1">
        {notifications.slice(0, MAX_NOTIFICATION_NUMBER_TO_RENDER).map((notification) => (
          <li
            key={notification.id}
            className={classNames(['bg-gray-100 p-4 rounded border-2', notificationToClassName(notification)])}
          >
            <div className="flex gap-2 items-start">
              <div className="font-semibold text-lg whitespace-nowrap text-ellipsis overflow-hidden">
                {notification.title}
              </div>
              <button className="ms-auto flex text-xl" onClick={() => onClickClose(notification)}>
                <BaseIcon path={mdiClose} />
              </button>
            </div>
            <div className="whitespace-nowrap text-ellipsis overflow-hidden" title={notification.description}>
              {notification.description}
            </div>
          </li>
        ))}
      </ul>
    )
  );
};
