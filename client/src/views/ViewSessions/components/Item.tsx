import { ITEM } from '@/constants/REACT_DND_ITEM_TYPES';
import type { Item as IItem } from '@/helpers/message';
import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';
import { useDrag } from 'react-dnd';

interface Props extends HTMLAttributes<HTMLDivElement> {
  item: IItem;
  isDraggable?: boolean;
}

export const Item: FC<Props> = (props) => {
  const [{ isDragging, canDrag }, dragRef] = useDrag(() => ({
    type: ITEM,
    item: props.item,
    canDrag: Boolean(props.isDraggable),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    }),
  }));

  return (
    <div
      className={classNames([
        'border size-full flex justify-center items-center select-none border-gray-400',
        props.className,
        isDragging && 'opacity-0',
        canDrag && 'cursor-pointer',
      ])}
      ref={dragRef}
    >
      {props.item.text}
    </div>
  );
};
