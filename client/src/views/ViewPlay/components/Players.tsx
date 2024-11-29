import type { Player } from '@/api/messages';
import { arePlayersEqual } from '@/helpers/player';
import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  players: Array<Player>;
  player?: Player;
  activePlayer?: Player;
}

//list-[disclosure-closed]

export const Players: FC<Props> = (props) => {
  const getClassName = (player: Player) => [
    'mb-2 last:mb-0',
    props.activePlayer && arePlayersEqual(player, props.activePlayer) && 'list-[disclosure-closed]',
    props.player && arePlayersEqual(player, props.player) && 'font-semibold text-primary-500 marker:text-body-initial',
  ];

  return (
    <ul className={classNames([props.className, 'list-inside'])}>
      {props.players.map((player, index) => (
        <li className={classNames(getClassName(player))} title={player.Id} key={index}>
          {player.Name} {props.player && arePlayersEqual(props.player, player) && '(you)'}
        </li>
      ))}
    </ul>
  );
};
