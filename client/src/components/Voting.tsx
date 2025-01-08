import { BaseIcon } from '@/components/ui/BaseIcon';
import { BaseWidget } from '@/components/ui/BaseWidget';
import { useGameSession } from '@/contexts/gameSession';
import { mdiBallotOutline } from '@mdi/js';
import { useEffect, useMemo, useState, type FC } from 'react';
import { BaseDialog } from '@/components/ui/BaseDialog';
import classNames from 'classnames';
import { BaseButton } from './ui/BaseButton';
import type { FunctionCallback } from '@/types';
import { VOTING_VALUE_TO_TEXT, VotingValue } from '@/helpers/voting';
import { useCountdown } from '@/hooks/useCountdown';
import { isNotNil } from '@/utils/isNotNil';
import { BaseProgressBar } from './ui/BaseProgressBar';
import { useThePlayer } from '@/contexts/thePlayer';

interface Props {
  onClickVotePositive: FunctionCallback;
  onClickVoteNegative: FunctionCallback;
}

export const Voting: FC<Props> = ({ onClickVoteNegative, onClickVotePositive }) => {
  const { activeVoting } = useGameSession();
  const thePlayer = useThePlayer();

  const playerVotedPositive = useMemo(
    () => Boolean(activeVoting?.playersVotedPositiveIds.includes(thePlayer.id)),
    [thePlayer, activeVoting],
  );

  const playerVotedNegative = useMemo(
    () => Boolean(activeVoting?.playersVotedNegativeIds.includes(thePlayer.id)),
    [thePlayer, activeVoting],
  );

  const playerVoted = useMemo(
    () => playerVotedPositive || playerVotedNegative,
    [playerVotedPositive, playerVotedNegative],
  );

  const [isDialogOpen, setIsDialogOpen] = useState(Boolean(activeVoting));

  const onClickWidget = () => setIsDialogOpen(true);
  const onCloseDialog = () => setIsDialogOpen(false);

  useEffect(() => setIsDialogOpen(Boolean(activeVoting)), [activeVoting]);

  const votingVariants = [
    {
      id: 0,
      text: VOTING_VALUE_TO_TEXT[VotingValue.Positive],
      votesNumber: activeVoting?.playersVotedPositiveIds.length ?? 0,
      shouldRenderButton: !playerVotedNegative,
      propsButton: {
        onClick: onClickVotePositive,
        children: `${VOTING_VALUE_TO_TEXT[VotingValue.Positive]}!`,
      },
    },
    {
      id: 1,
      text: VOTING_VALUE_TO_TEXT[VotingValue.Negative],
      votesNumber: activeVoting?.playersVotedNegativeIds.length ?? 0,
      shouldRenderButton: !playerVotedPositive,
      propsButton: {
        onClick: onClickVoteNegative,
        children: `${VOTING_VALUE_TO_TEXT[VotingValue.Negative]}!`,
      },
    },
  ];

  const { startTo, stop, timeRemain, timeEnd, partPassed } = useCountdown();

  useEffect(() => {
    if (!activeVoting) {
      return stop();
    }

    if (activeVoting.timerLimits.endAt === timeEnd) {
      return;
    }

    startTo(activeVoting.timerLimits.endAt, { timeStart: activeVoting.timerLimits.startAt });
  }, [activeVoting, timeEnd, stop, startTo]);

  return (
    <>
      <BaseWidget className={classNames(isDialogOpen && 'hidden')} onClick={onClickWidget}>
        <BaseIcon path={mdiBallotOutline} />
        {isNotNil(partPassed) && (
          <BaseProgressBar className="h-1 absolute bottom-0 start-0 pointer-events-none" value={partPassed} />
        )}
      </BaseWidget>
      {activeVoting && (
        <BaseDialog open={isDialogOpen} onClose={onCloseDialog} title={['Голосование', activeVoting.title].join(' ')}>
          <div className="flex gap-4">
            {votingVariants.map((votingVariant) => (
              <div className="flex-1" key={votingVariant.id}>
                <div className="mb-2 font-semibold">{votingVariant.text}</div>
                <div className="text-8xl">{votingVariant.votesNumber}</div>
                {!playerVoted && <BaseButton {...votingVariant.propsButton} className="w-full mt-8 justify-center" />}
              </div>
            ))}
          </div>
          {playerVoted && (
            <div className="mt-4">
              <span>Ты уже проголосовал! </span>(
              <span className="text-primary-500 font-semibold">
                {
                  //
                  playerVotedPositive
                    ? VOTING_VALUE_TO_TEXT[VotingValue.Positive]
                    : VOTING_VALUE_TO_TEXT[VotingValue.Negative]
                }
              </span>
              )
            </div>
          )}
          {isNotNil(timeRemain) && isNotNil(partPassed) && (
            <>
              <div className="mt-8 text-gray-500 text-sm text-end">
                {['Заканчивается', ...(timeRemain > 3000 ? [`через ${(timeRemain / 1000).toFixed(1)}c`] : [])].join(
                  ' ',
                )}
              </div>
              <BaseProgressBar className="absolute bottom-0 start-0" value={partPassed} />
            </>
          )}
        </BaseDialog>
      )}
    </>
  );
};
