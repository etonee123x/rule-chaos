import type { SessionState } from '@/helpers/message';
import { createContext } from 'react';

export type SessionContext = SessionState;

export const SessionContext = createContext<SessionContext | null>(null);
