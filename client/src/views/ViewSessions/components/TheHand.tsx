import { ITEM } from '@/constants/REACT_DND_ITEM_TYPES';
import type { Item } from '@/helpers/message';
import classNames from 'classnames';
import { type FC, type HTMLAttributes, type WheelEventHandler } from 'react';
import { useDrag } from 'react-dnd';

interface Props extends HTMLAttributes<HTMLDivElement> {
  items: Array<Item>;
}

const ComponentItem: FC<{ item: Item }> = (props) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ITEM,
    item: props.item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      className={classNames([
        'border size-full flex justify-center items-center cursor-pointer select-none border-gray-400',
        isDragging && 'opacity-0',
      ])}
      ref={dragRef}
    >
      {props.item.text}
    </div>
  );
};

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
        <ul className="pb-2 flex gap-2 overflow-x-scroll size-full" onWheel={onWheel}>
          {props.items.map((item, index) => (
            <li className="shrink-0 aspect-square" key={index}>
              <ComponentItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
