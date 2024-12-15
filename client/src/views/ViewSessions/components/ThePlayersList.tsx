import { useSession } from '@/contexts/sessionContext';
import { arePlayersEqual } from '@/helpers/player';
import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const ThePlayersList: FC<Props> = (props) => {
  const { players, player, activePlayer } = useSession();

  return (
    <div className={props.className}>
      <div className="sticky top-0 bg-white pb-2 text-xl">Игроки:</div>
      <ul className="list-inside">
        {players.map((_player, index) => (
          <li
            className={classNames([
              'mb-1 last:mb-0 text-lg',
              activePlayer && arePlayersEqual(_player, activePlayer) && 'list-[disclosure-closed]',
              player && arePlayersEqual(player, _player) && 'font-semibold text-primary-500 marker:text-body-initial',
            ])}
            key={index}
          >
            {_player.name} {player && arePlayersEqual(player, _player) && '(you)'}
          </li>
        ))}
      </ul>
    </div>
  );
};
