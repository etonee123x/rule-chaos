import { useSession } from '@/contexts/sessionContext';
import { arePlayersEqual, type Player } from '@/helpers/player';
import classNames from 'classnames';
import { useMemo, type FC, type HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const ThePlayersList: FC<Props> = (props) => {
  const { playersInSession, playersInRound, player, activePlayer } = useSession();

  const playersInWaitingRoom = useMemo(
    () =>
      playersInSession.filter(
        (playerInSession) => !playersInRound.some((playerInRound) => arePlayersEqual(playerInRound, playerInSession)),
      ),
    [playersInRound, playersInSession],
  );

  const Players: FC<{ players: Array<Player>; sectionText: string }> = (props) => (
    <div className="bg-gray-100 p-2 rounded mb-4 last:mb-0">
      <div className="text-gray-500">
        {props.sectionText} ({props.players.length})
      </div>
      <hr className="my-1" />
      <ul className="list-inside">
        {props.players.map((_player) => (
          <li
            key={_player.id}
            className={classNames([
              'text-lg',
              activePlayer && arePlayersEqual(_player, activePlayer) && 'list-[disclosure-closed]',
              player && arePlayersEqual(player, _player) && 'font-semibold text-primary-500 marker:text-body-initial',
            ])}
          >
            {_player.name} {player && arePlayersEqual(player, _player) && '(you)'}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={props.className}>
      <div className="sticky top-0 bg-white pb-2 text-xl">Игроки ({playersInSession.length}):</div>
      {playersInRound.length > 0 && <Players players={playersInRound} sectionText="В игре" />}
      {playersInWaitingRoom.length > 0 && <Players players={playersInWaitingRoom} sectionText="Ожидание" />}
    </div>
  );
};
