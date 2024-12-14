import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const SIZE = 8;

const indexToRowCol = (index: number) => ({
  row: Math.floor(index / SIZE),
  col: index % SIZE,
});

const getCellClassNameByIndex = (index: number) => {
  const { row, col } = indexToRowCol(index);

  return classNames([(row + col) % 2 ? 'bg-primary-300' : 'bg-gray-200']);
};

export const TheField: FC<Props> = (props) => (
  <div className={classNames([props.className, 'aspect-square'])}>
    <div className="size-full grid grid-cols-8 border-8 border-gray-400">
      {Array.from({ length: SIZE * SIZE }, (...[, index]) => (
        <div key={index} className={getCellClassNameByIndex(index)}></div>
      ))}
    </div>
  </div>
);
