import { ITEM } from '@/constants/REACT_DND_ITEM_TYPES';
import type { Item } from '@/helpers/message';
import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';
import { useDrop } from 'react-dnd';

interface PropsTheField extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  onDrop: (item: Item, [row, col]: [number, number]) => void | Promise<void>;
}

interface PropsCell {
  row: number;
  col: number;
  onDrop: (item: Item) => void | Promise<void>;
}

const SIZE = 8;

const indexToRowCol = (index: number) => ({
  row: Math.floor(index / SIZE),
  col: index % SIZE,
});

const Cell: FC<PropsCell> = (props) => {
  const [, dropRef] = useDrop(() => ({
    accept: ITEM,
    drop: props.onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={dropRef}
      className={classNames(['relative', (props.row + props.col) % 2 ? 'bg-primary-300' : 'bg-gray-200'])}
    >
      <div className="text-xs absolute bottom-0 end-0.5 text-gray-500">
        {props.row + 1}:{props.col + 1}
      </div>
    </div>
  );
};

export const TheField: FC<PropsTheField> = (props) => (
  <div className={classNames([props.className, 'aspect-square'])}>
    <div className="size-full grid grid-cols-8 border-8 border-gray-400">
      {Array.from({ length: SIZE * SIZE }, (...[, index]) => {
        const { row, col } = indexToRowCol(index);

        return <Cell row={row} col={col} key={index} onDrop={(item) => props.onDrop(item, [row, col])} />;
      })}
    </div>
  </div>
);
