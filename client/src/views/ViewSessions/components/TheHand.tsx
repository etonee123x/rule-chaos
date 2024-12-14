import type { Item } from '@/helpers/message';
import classNames from 'classnames';
import { type FC, type HTMLAttributes, type WheelEventHandler } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  items: Array<Item>;
}

export const TheHand: FC<Props> = (props) => {
  const onWheel: WheelEventHandler<HTMLUListElement> = (event) => {
    if (!event.deltaY) {
      return;
    }

    event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
  };

  return (
    <div className={classNames([props.className, 'bg-gray-200 p-2 flex items-center'])}>
      {props.items.length === 0 ? (
        <span className="text-2xl mx-auto">Нету предметов!</span>
      ) : (
        <ul className={classNames('pb-2 flex gap-2 overflow-x-scroll size-full')} onWheel={onWheel}>
          {props.items.map((item, index) => (
            <li
              key={index}
              className="aspect-square border shrink-0 flex justify-center items-center cursor-pointer select-none border-gray-400"
            >
              <div>{item.text}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
