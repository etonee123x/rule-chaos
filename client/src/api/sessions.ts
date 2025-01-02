import { client } from '@/api/_client';
import type { Player } from '@/helpers/player';

export interface Session {
  id: string;
  playersInSession: Array<Player>;
}

export const post = (formData: FormData) => client<Session>('/sessions', { method: 'POST', body: formData });

export const getAll = () => client<Array<Session>>('/sessions');
