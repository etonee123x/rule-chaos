import { ITEM } from '@/constants/REACT_DND_ITEM_TYPES';
import { useGameSession } from '@/contexts/gameSession';
import type { Item as IItem, ItemWithPosition } from '@/helpers/message';
import classNames from 'classnames';
import { useMemo, type FC, type HTMLAttributes } from 'react';
import { useDrop } from 'react-dnd';
import { Item } from './Item';
import { arePositionsEqual } from '@/helpers/position';

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

const Cell: FC<PropsCell> = ({ col, row, onDrop }) => {
  const { itemsOnField } = useGameSession();

  const position = useMemo(() => ({ col, row }), [col, row]);

  const maybeItem = useMemo(
    () => itemsOnField.find((itemOnField) => arePositionsEqual(itemOnField.position, position)),
    [itemsOnField, position],
  );

  const cellHasItem = useMemo(() => Boolean(maybeItem), [maybeItem]);

  const [{ canDrop, isOver }, dropRef] = useDrop(
    () => ({
      accept: ITEM,
      drop: (item: IItem) => onDrop({ ...item, position }),
      canDrop: () => !cellHasItem,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [cellHasItem],
  );

  const cantDropHere = useMemo(() => !canDrop && isOver, [canDrop, isOver]);

  const FallBack = () => (
    <div className="text-xs absolute bottom-0 end-0.5 text-gray-500">
      {row + 1}:{col + 1}
    </div>
  );

  const className = useMemo(() => {
    let bgClass = cantDropHere ? 'bg-red-400' : undefined;

    bgClass ??= (row + col) % 2 ? 'bg-primary-300' : 'bg-gray-200';

    return classNames([
      'aspect-square relative flex items-center justify-center',
      bgClass,
      cantDropHere && 'cursor-not-allowed',
    ]);
  }, [cantDropHere, row, col]);

  return (
    <div ref={dropRef} className={className}>
      {maybeItem ? (
        <Item className={classNames(['size-11/12', cantDropHere && 'animate-shake-protesting'])} item={maybeItem} />
      ) : (
        <FallBack />
      )}
    </div>
  );
};

export const TheField: FC<PropsTheField> = ({ className, onDrop }) => (
  <div className={classNames(className)}>
    <div className="size-full grid grid-cols-8 border-8 border-gray-400">
      {Array.from({ length: SIZE * SIZE }, (...[, index]) => {
        const { row, col } = indexToRowCol(index);

        return <Cell row={row} col={col} key={index} onDrop={onDrop} />;
      })}
    </div>
  </div>
);
