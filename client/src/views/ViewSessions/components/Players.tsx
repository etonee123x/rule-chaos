import { arePlayersEqual, type Player } from '@/helpers/player';
import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  players: Array<Player>;
  player?: Player;
  activePlayer?: Player;
}

export const Players: FC<Props> = (props) => (
  <div className={props.className}>
    Игроки:
    <ul className="list-inside">
      {props.players.map((player, index) => (
        <li
          className={classNames([
            'mb-2 last:mb-0',
            props.activePlayer && arePlayersEqual(player, props.activePlayer) && 'list-[disclosure-closed]',
            props.player &&
              arePlayersEqual(player, props.player) &&
              'font-semibold text-primary-500 marker:text-body-initial',
          ])}
          title={player.id}
          key={index}
        >
          {player.name} {props.player && arePlayersEqual(props.player, player) && '(you)'}
        </li>
      ))}
    </ul>
  </div>
);
