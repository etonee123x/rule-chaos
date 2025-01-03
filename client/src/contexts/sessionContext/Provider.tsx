import type { FC, PropsWithChildren } from 'react';
import { SessionContext } from './_context';

interface Props extends PropsWithChildren {
  session: SessionContext;
}

export const SessionProvider: FC<Props> = ({ session, children }) => (
  <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
);
