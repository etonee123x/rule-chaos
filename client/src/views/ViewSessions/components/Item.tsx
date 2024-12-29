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
        UI.ITEM._name,
        props.className,
        isDragging && UI.ITEM.DRAGGING,
        isDraggable && UI.ITEM.DRAGGABLE,
      ])}
      title={props.title}
      ref={dragRef}
    >
      {props.item.text}
    </div>
  );
};
