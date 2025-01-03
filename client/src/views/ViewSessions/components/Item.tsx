import { ITEM } from '@/constants/REACT_DND_ITEM_TYPES';
import type { Item as IItem } from '@/helpers/message';
import { UI } from '@/helpers/ui';
import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';
import { useDrag } from 'react-dnd';

interface Props extends HTMLAttributes<HTMLDivElement> {
  item: IItem;
  isDraggable?: boolean;
}

export const Item: FC<Props> = ({ isDraggable: _isDraggable, item, className, title }) => {
  const isDraggable = Boolean(_isDraggable);

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: ITEM,
      item,
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
        UI.ITEM._name,
        className,
        isDragging && UI.ITEM.DRAGGING,
        isDraggable && UI.ITEM.DRAGGABLE,
      ])}
      title={title}
      ref={dragRef}
    >
      {item.text}
    </div>
  );
};
