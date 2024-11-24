import type { Player } from '@/api/messages';
import { arePlayersEqual } from '@/helpers/player';
import type { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  players: Array<Player>;
  player?: Player;
  activePlayer?: Player;
}

//list-[disclosure-closed]

export const Players: FC<Props> = (props) => {
  const getClassName = (player: Player) => {
    const className = ['mb-2 last:mb-0'];

    if (props.activePlayer && arePlayersEqual(player, props.activePlayer)) {
      className.push('list-[disclosure-closed]');
    }

    if (props.player && arePlayersEqual(player, props.player)) {
      className.push('font-semibold text-primary-500 marker:text-body-initial');
    }

    return className.join(' ');
  };

  return (
    <ul className={[...(props.className ? [props.className] : []), 'list-inside'].join(' ')}>
      {props.players.map((player, index) => (
        <li className={getClassName(player)} title={player.Id} key={index}>
          {player.Name} {props.player && arePlayersEqual(props.player, player) && '(you)'}
        </li>
      ))}
    </ul>
  );
};
