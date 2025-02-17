import { useGameSession } from '@/contexts/gameSession';
import classNames from 'classnames';
import { useCallback, type FC, type HTMLAttributes, type WheelEventHandler } from 'react';
import { Item } from './Item';
import { useThePlayer } from '@/contexts/thePlayer';
import { UI } from '@/helpers/ui';

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const TheHand: FC<Props> = ({ className }) => {
  const { itemsInHand } = useGameSession();
  const thePlayer = useThePlayer();

  const onWheel: WheelEventHandler<HTMLUListElement> = useCallback((event) => {
    if (!event.deltaY) {
      return;
    }

    event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
  }, []);

  return (
    <div className={classNames([className, UI.ACCENTED_BLOCK, ' flex items-center relative'])}>
      {itemsInHand.length === 0 ? (
        <span className="text-2xl mx-auto">Нету предметов!</span>
      ) : (
        <>
          <ul className="pb-2 flex gap-2 overflow-x-scroll size-full" onWheel={onWheel}>
            {itemsInHand.map((item, index) => (
              <li className="shrink-0 aspect-square" key={index}>
                <Item
                  title={thePlayer.isActive ? '' : 'Ход другого игрока'}
                  className={classNames(['size-full', !thePlayer.isActive && 'cursor-not-allowed'])}
                  item={item}
                  isDraggable={thePlayer.isActive}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
