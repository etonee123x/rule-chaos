import type { Player } from '@/helpers/player';
import { createContext } from 'react';

export type ThePlayerContext = Player;

export const ThePlayerContext = createContext<ThePlayerContext | null>(null);
