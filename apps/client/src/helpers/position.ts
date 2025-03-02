import type { Position } from './message';

export const arePositionsEqual = (position1: Position, position2: Position) =>
  position1.col === position2.col && position1.row === position2.row;
