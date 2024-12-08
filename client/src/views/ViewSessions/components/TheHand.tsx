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
    <div className={classNames([props.className])}>
      <ul className={classNames('flex gap-2 py-2 overflow-x-auto h-full')} onWheel={onWheel}>
        {props.items.slice(0, 12).map((item, index) => (
          <li
            key={index}
            className="aspect-square max-h-24 border shrink-0 flex justify-center items-center cursor-pointer select-none"
          >
            <div>{item.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
