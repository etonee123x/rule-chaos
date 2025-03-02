import { BaseButton } from '@rule-chaos/components/BaseButton';
import { useGameSession } from '@/contexts/gameSession';
import { useThePlayer } from '@/contexts/thePlayer';
import { VOTING_VALUE_TO_TEXT, VotingValue } from '@/helpers/voting';
import type { FunctionCallback } from '@rule-chaos/types';
import { isNotNil } from '@rule-chaos/utils/isNotNil';
import { useMemo, type FC } from 'react';
import { BaseProgressBar } from '@rule-chaos/components/BaseProgressBar';
import { useActiveVotingCountDown } from '@/hooks/useActiveVotingCountdown';

export interface Props {
  onClickVotePositive: FunctionCallback;
  onClickVoteNegative: FunctionCallback;
}

export const VotingActive: FC<Props> = ({ onClickVoteNegative, onClickVotePositive }) => {
  const { activeVoting } = useGameSession();
  const thePlayer = useThePlayer();
  const { partPassed, timeRemain } = useActiveVotingCountDown();

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

  return (
    <>
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
            {['Заканчивается', ...(timeRemain > 3000 ? [`через ${(timeRemain / 1000).toFixed(1)}c`] : [])].join(' ')}
          </div>
          <BaseProgressBar className="absolute bottom-0 start-0" value={partPassed} />
        </>
      )}
    </>
  );
};
