import { ITEM } from '@/constants/REACT_DND_ITEM_TYPES';
import { useSession } from '@/contexts/sessionContext';
import type { Item as IItem, ItemWithPosition } from '@/helpers/message';
import { pick } from '@/utils/pick';
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

const Cell: FC<PropsCell> = (props) => {
  const { itemsOnField } = useSession();

  const position = useMemo(() => pick(props, ['col', 'row']), [props]);

  const maybeItem = useMemo(
    () => itemsOnField.find((itemOnField) => arePositionsEqual(itemOnField.position, position)),
    [itemsOnField, position],
  );

  const cellHasItem = useMemo(() => Boolean(maybeItem), [maybeItem]);

  const [{ canDrop, isOver }, dropRef] = useDrop(
    () => ({
      accept: ITEM,
      drop: (item: IItem) => props.onDrop({ ...item, position }),
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
      {props.row + 1}:{props.col + 1}
    </div>
  );

  const className = useMemo(() => {
    let bgClass = cantDropHere ? 'bg-red-400' : undefined;

    bgClass ??= (props.row + props.col) % 2 ? 'bg-primary-300' : 'bg-gray-200';

    return classNames([
      'aspect-square relative flex items-center justify-center',
      bgClass,
      cantDropHere && 'cursor-not-allowed',
    ]);
  }, [cantDropHere, props]);

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
