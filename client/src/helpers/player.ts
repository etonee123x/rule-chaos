import type { Player } from '@/api/messages';

export const arePlayersEqual = (player1: Player, player2: Player) => player1.id === player2.id;
