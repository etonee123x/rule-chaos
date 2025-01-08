import type { FC, PropsWithChildren } from 'react';
import { ThePlayerContext } from './_context';

interface Props extends PropsWithChildren {
  thePlayer: ThePlayerContext;
}

export const ThePlayerProvider: FC<Props> = ({ thePlayer, children }) => (
  <ThePlayerContext.Provider value={thePlayer}>{children}</ThePlayerContext.Provider>
);
