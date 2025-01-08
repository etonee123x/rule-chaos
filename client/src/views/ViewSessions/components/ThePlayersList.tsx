import { BaseProgressBar } from '@/components/ui/BaseProgressBar';
import { useGameSession } from '@/contexts/gameSession';
import { useThePlayer } from '@/contexts/thePlayer';
import { arePlayersEqual, type Player } from '@/helpers/player';
import { useCountdown } from '@/hooks/useCountdown';
import { isNil } from '@/utils/isNil';
import { isNotNil } from '@/utils/isNotNil';
import classNames from 'classnames';
import { useEffect, useMemo, type FC, type HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const ThePlayersList: FC<Props> = ({ className }) => {
  const { players, turnTimerLimits } = useGameSession();
  const thePlayer = useThePlayer();

  const playersInRound = useMemo(() => players.filter((player) => player.isInRound), [players]);
  const playersNotInRound = useMemo(() => players.filter((player) => !player.isInRound), [players]);

  const { partPassed, startTo, stop } = useCountdown();

  useEffect(
    () => (isNil(turnTimerLimits) ? stop() : startTo(turnTimerLimits.endAt, { timeStart: turnTimerLimits.startAt })),
    [turnTimerLimits, stop, startTo],
  );

  const Players: FC<{ players: Array<Player>; sectionText: string }> = ({ sectionText, players }) => (
    <div className="bg-gray-100 p-2 rounded mb-4 last:mb-0">
      <div className="text-gray-500">
        {sectionText} ({players.length})
      </div>
      <hr className="my-1" />
      <ul className="list-inside">
        {players.map((player) => (
          <li
            key={player.id}
            className={classNames([
              'text-lg',
              player.isActive && 'list-[disclosure-closed]',
              arePlayersEqual(thePlayer, player) && 'font-semibold text-primary-500 marker:text-body-initial',
            ])}
          >
            {player.name} {arePlayersEqual(thePlayer, player) && '(you)'}
            {player.isActive && isNotNil(partPassed) && (
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
      {playersInRound.length > 0 && <Players players={playersInRound} sectionText="В игре" />}
      {playersNotInRound.length > 0 && <Players players={playersNotInRound} sectionText="Ожидание" />}
    </div>
  );
};
