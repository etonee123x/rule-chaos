import { useSession } from '@/contexts/sessionContext';
import classNames from 'classnames';
import { useCallback, type FC, type HTMLAttributes, type WheelEventHandler } from 'react';
import { Item } from './Item';
import { useIsActivePlayer } from '@/hooks/useIsActivePlayer';

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const TheHand: FC<Props> = ({ className }) => {
  const { itemsInHand } = useSession();
  const isActivePlayer = useIsActivePlayer();

  const onWheel: WheelEventHandler<HTMLUListElement> = useCallback((event) => {
    if (!event.deltaY) {
      return;
    }

    event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
  }, []);

  return (
    <div className={classNames([className, 'bg-gray-200 p-2 flex items-center relative'])}>
      {itemsInHand.length === 0 ? (
        <span className="text-2xl mx-auto">Нету предметов!</span>
      ) : (
        <>
          <ul className="pb-2 flex gap-2 overflow-x-scroll size-full" onWheel={onWheel}>
            {itemsInHand.map((item, index) => (
              <li className="shrink-0 aspect-square" key={index}>
                <Item
                  title={isActivePlayer ? '' : 'Ход другого игрока'}
                  className={classNames(['size-full', !isActivePlayer && 'cursor-not-allowed'])}
                  item={item}
                  isDraggable={isActivePlayer}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
