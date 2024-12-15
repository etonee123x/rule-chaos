import type { FC, PropsWithChildren } from 'react';
import { SessionContext } from './_context';

interface Props extends PropsWithChildren {
  session: SessionContext;
}

export const SessionProvider: FC<Props> = (props) => (
  <SessionContext.Provider value={props.session}>{props.children}</SessionContext.Provider>
);
