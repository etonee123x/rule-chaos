import type { GameSession } from '@/helpers/message';
import { createContext } from 'react';

export type GameSessionContext = GameSession;

export const GameSessionContext = createContext<GameSessionContext | null>(null);
