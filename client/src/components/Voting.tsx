import { BaseIcon } from '@/components/ui/BaseIcon';
import { BaseWidget } from '@/components/ui/BaseWidget';
import { useSession } from '@/contexts/sessionContext';
import { mdiBallotOutline } from '@mdi/js';
import { useEffect, useMemo, useState, type FC } from 'react';
import { BaseDialog } from '@/components/ui/BaseDialog';
import classNames from 'classnames';
import { BaseButton } from './ui/BaseButton';
import type { FunctionCallback } from '@/types';
import { VOTING_VALUE_TO_TEXT, VotingValue } from '@/helpers/voting';

interface Props {
  onVotePositive: FunctionCallback;
  onVoteNegative: FunctionCallback;
}

export const Voting: FC<Props> = (props) => {
  const { activeVoting, player } = useSession();

  const playerVotedPositive = useMemo(
    () => Boolean(player && activeVoting?.playersVotedPositiveIds.includes(player.id)),
    [player, activeVoting],
  );

  const playerVotedNegative = useMemo(
    () => Boolean(player && activeVoting?.playersVotedNegativeIds.includes(player.id)),
    [player, activeVoting],
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
        onClick: props.onVotePositive,
        children: `${VOTING_VALUE_TO_TEXT[VotingValue.Positive]}!`,
      },
    },
    {
      id: 1,
      text: VOTING_VALUE_TO_TEXT[VotingValue.Negative],
      votesNumber: activeVoting?.playersVotedNegativeIds.length ?? 0,
      shouldRenderButton: !playerVotedPositive,
      propsButton: {
        onClick: props.onVoteNegative,
        children: `${VOTING_VALUE_TO_TEXT[VotingValue.Negative]}!`,
      },
    },
  ];

  return (
    <>
      <BaseWidget className={classNames(isDialogOpen && 'hidden')} onClick={onClickWidget}>
        <BaseIcon path={mdiBallotOutline} />
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
        </BaseDialog>
      )}
    </>
  );
};
