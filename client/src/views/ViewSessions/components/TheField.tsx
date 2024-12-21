import { ITEM } from '@/constants/REACT_DND_ITEM_TYPES';
import { useSession } from '@/contexts/sessionContext';
import type { Item, ItemWithPosition } from '@/helpers/message';
import { pick } from '@/utils/pick';
import classNames from 'classnames';
import { useMemo, type FC, type HTMLAttributes } from 'react';
import { useDrop } from 'react-dnd';

interface PropsTheField extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  onDrop: (itemOnField: ItemWithPosition) => void | Promise<void>;
}

interface PropsCell {
  row: number;
  col: number;
  onDrop: (item: ItemWithPosition) => void | Promise<void>;
}

const SIZE = 8;

const indexToRowCol = (index: number) => ({
  row: Math.floor(index / SIZE),
  col: index % SIZE,
});

const Cell: FC<PropsCell> = (props) => {
  const { itemsOnField } = useSession();

  const [, dropRef] = useDrop<Item>(() => ({
    accept: ITEM,
    drop: (item) => props.onDrop({ ...item, position: pick(props, ['col', 'row']) }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const maybeItem = useMemo(
    () => itemsOnField.find((item) => item.position.col === props.col && item.position.row === props.row),
    [itemsOnField, props.col, props.row],
  );

  return (
    <div
      ref={dropRef}
      className={classNames(['relative', (props.row + props.col) % 2 ? 'bg-primary-300' : 'bg-gray-200'])}
    >
      <pre>{JSON.stringify(maybeItem)}</pre>
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

        return <Cell row={row} col={col} key={index} onDrop={props.onDrop} />;
      })}
    </div>
  </div>
);
