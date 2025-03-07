export interface Player {
  name: string;
  id: string;
  isInRound: boolean;
  isActive: boolean;
  score: number;
}

export const arePlayersEqual = (player1: Player, player2: Player) => player1.id === player2.id;
