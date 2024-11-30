import { client } from '@/api/_client';
import type { Player } from './messages';

export interface Session {
  id: string;
  players: Array<Player>;
}

export const post = (formData: FormData) => client<Session>('/sessions', { method: 'POST', body: formData });

export const getAll = () => client<Array<Session>>('/sessions');
