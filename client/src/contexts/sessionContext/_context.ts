import type { HistoryRecord, Item } from '@/helpers/message';
import type { Player } from '@/helpers/player';
import { createContext } from 'react';

export interface SessionContext {
  players: Array<Player>;
  player: Player | null;
  activePlayer: Player | null;
  items: Array<Item>;
  history: Array<HistoryRecord>;
}

export const SessionContext = createContext<SessionContext | null>(null);
