import { BaseProgressBar } from '@/components/ui/BaseProgressBar';
import { useSession } from '@/contexts/sessionContext';
import { arePlayersEqual, type Player } from '@/helpers/player';
import { useCountdown } from '@/hooks/useCountdown';
import { isNil } from '@/utils/isNil';
import { isNotNil } from '@/utils/isNotNil';
import classNames from 'classnames';
import { useEffect, useMemo, type FC, type HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const ThePlayersList: FC<Props> = ({ className }) => {
  const { players, player, activePlayerAbsoluteTimerLimits } = useSession();

  const playersTypeToPlayers = useMemo(
    () =>
      players.reduce<{ inRound: Array<Player>; inWaitingRoom: Array<Player> }>(
        (acc, player) => {
          if (player.isInRound) {
            acc.inRound.push(player);
          } else {
            acc.inWaitingRoom.push(player);
          }

          return acc;
        },
        { inRound: [], inWaitingRoom: [] },
      ),
    [players],
  );

  const { partPassed, startTo, stop } = useCountdown();

  useEffect(
    () =>
      isNil(activePlayerAbsoluteTimerLimits)
        ? stop()
        : startTo(activePlayerAbsoluteTimerLimits.endAt, { timeStart: activePlayerAbsoluteTimerLimits.startAt }),
    [activePlayerAbsoluteTimerLimits, stop, startTo],
  );

  const Players: FC<{ players: Array<Player>; sectionText: string }> = ({ sectionText, players }) => (
    <div className="bg-gray-100 p-2 rounded mb-4 last:mb-0">
      <div className="text-gray-500">
        {sectionText} ({players.length})
      </div>
      <hr className="my-1" />
      <ul className="list-inside">
        {players.map((_player) => (
          <li
            key={_player.id}
            className={classNames([
              'text-lg',
              _player.isActive && 'list-[disclosure-closed]',
              player && arePlayersEqual(player, _player) && 'font-semibold text-primary-500 marker:text-body-initial',
            ])}
          >
            {_player.name} {player && arePlayersEqual(player, _player) && '(you)'}
            {_player.isActive && isNotNil(partPassed) && (
              <BaseProgressBar className="h-1" value={partPassed} isProgressInverted />
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={className}>
      <div className="sticky top-0 bg-white pb-2 text-xl">Игроки ({players.length}):</div>
      {playersTypeToPlayers.inRound.length > 0 && (
        <Players players={playersTypeToPlayers.inRound} sectionText="В игре" />
      )}
      {playersTypeToPlayers.inWaitingRoom.length > 0 && (
        <Players players={playersTypeToPlayers.inWaitingRoom} sectionText="Ожидание" />
      )}
    </div>
  );
};
