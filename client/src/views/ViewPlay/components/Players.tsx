import type { Player } from '@/api/messages';
import type { FC } from 'react';

export const Players: FC<{ playersNames: Array<Player['name']> }> = (props) => (
  <ul>
    {props.playersNames.map((playerName, index) => (
      <li key={index}>{playerName}</li>
    ))}
  </ul>
);
