import { useGameSession } from '@/contexts/gameSession';
import { useThePlayer } from '@/contexts/thePlayer';
import { arePlayersEqual, type Player } from '@/helpers/player';
import classNames from 'classnames';
import { useMemo, type FC, type HTMLAttributes } from 'react';
import { TurnTimerLimitProgressBar } from './TurnTimerLimitProgressBar';
import { UI } from '@/helpers/ui';

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const ThePlayersList: FC<Props> = ({ className }) => {
  const { players, turnTimerLimits } = useGameSession();
  const thePlayer = useThePlayer();

  const playersInRound = useMemo(() => players.filter((player) => player.isInRound), [players]);
  const playersNotInRound = useMemo(() => players.filter((player) => !player.isInRound), [players]);

  const Players: FC<{ players: Array<Player>; sectionText: string; shouldRenderScores?: boolean }> = ({
    sectionText,
    players,
    shouldRenderScores,
  }) => (
    <div className={UI.ACCENTED_BLOCK}>
      <div className="text-gray-500">
        {sectionText} ({players.length})
      </div>
      <hr className="my-1" />
      <ul>
        {players.map((player) => (
          <li
            key={player.id}
            className={classNames([
              'text-lg',
              arePlayersEqual(thePlayer, player) && 'font-semibold text-primary-500 marker:text-body-initial',
            ])}
          >
            <div className="flex justify-between">
              <div>
                {player.isActive && '>'} {player.name} {arePlayersEqual(thePlayer, player) && '(you)'}
              </div>
              {shouldRenderScores && <div>{String(player.score)}</div>}
            </div>
            {player.isActive && turnTimerLimits && <TurnTimerLimitProgressBar />}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={classNames(className, ['*:mb-4 last:*:mb-0'])}>
      {playersInRound.length > 0 && (
        <Players players={playersInRound} sectionText="Игроки в раунде" shouldRenderScores />
      )}
      {playersNotInRound.length > 0 && <Players players={playersNotInRound} sectionText="Игроки в ожидании" />}
    </div>
  );
};
