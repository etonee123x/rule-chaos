import type { FC, PropsWithChildren } from 'react';
import { GameSessionContext } from './_context';

interface Props extends PropsWithChildren {
  gameSession: GameSessionContext;
}

export const GameSessionProvider: FC<Props> = ({ gameSession, children }) => (
  <GameSessionContext.Provider value={gameSession}>{children}</GameSessionContext.Provider>
);
