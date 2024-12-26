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
  const isDraggable = Boolean(props.isDraggable);

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: ITEM,
      item: props.item,
      canDrag: isDraggable,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [isDraggable],
  );

  return (
    <div
      className={classNames([
        'border flex justify-center items-center select-none border-gray-400',
        props.className,
        isDragging && 'opacity-0',
        isDraggable && 'cursor-pointer',
      ])}
      ref={dragRef}
    >
      {props.item.text}
    </div>
  );
};
