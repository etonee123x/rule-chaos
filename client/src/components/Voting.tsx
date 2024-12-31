import { BaseIcon } from '@/components/ui/BaseIcon';
import { BaseWidget } from '@/components/ui/BaseWidget';
import { useSession } from '@/contexts/sessionContext';
import { mdiBallotOutline } from '@mdi/js';
import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { BaseDialog } from '@/components/ui/BaseDialog';
import classNames from 'classnames';
import { BaseButton, type Props as PropsButton } from './ui/BaseButton';
import type { Voting as IVoting } from '@/helpers/voting';
import type { FunctionCallback } from '@/types';

interface VotingVariant {
  text: string;
  votesNumber: number;
  shouldRenderButton: boolean;
  propsButton: PropsButton;
}

const VotingVariant: FC<{ votingVariant: VotingVariant }> = (props) => (
  <div className="flex-1">
    <div className="mb-2 font-semibold">{props.votingVariant.text}</div>
    <div className="mb-8 text-8xl">{props.votingVariant.votesNumber}</div>
    {props.votingVariant.shouldRenderButton && (
      <BaseButton {...props.votingVariant.propsButton} className="w-full justify-center" />
    )}
  </div>
);

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

  const getVotingVariantPositive = useCallback<(activeVoting: IVoting) => VotingVariant>(
    (activeVoting) => ({
      text: 'ЗА',
      votesNumber: activeVoting.playersVotedPositiveIds.length,
      shouldRenderButton: !playerVotedNegative,
      propsButton: {
        disabled: playerVoted,
        onClick: props.onVotePositive,
        children: 'За!',
      },
    }),
    [props, playerVoted, playerVotedNegative],
  );

  const getVotingVariantNegative = useCallback<(activeVoting: IVoting) => VotingVariant>(
    (activeVoting) => ({
      text: 'ПРОТИВ',
      votesNumber: activeVoting.playersVotedNegativeIds.length,
      shouldRenderButton: !playerVotedPositive,
      propsButton: {
        disabled: playerVoted,
        onClick: props.onVoteNegative,
        children: 'Против!',
      },
    }),
    [props, playerVoted, playerVotedPositive],
  );

  useEffect(() => setIsDialogOpen(Boolean(activeVoting)), [activeVoting]);

  return (
    <>
      <BaseWidget className={classNames(isDialogOpen && 'hidden')} onClick={onClickWidget}>
        <BaseIcon path={mdiBallotOutline} />
      </BaseWidget>
      {activeVoting && (
        <BaseDialog open={isDialogOpen} onClose={onCloseDialog} title={['Голосование', activeVoting.title].join(' ')}>
          <div className="flex gap-4">
            <VotingVariant votingVariant={getVotingVariantPositive(activeVoting)} />
            <VotingVariant votingVariant={getVotingVariantNegative(activeVoting)} />
          </div>
        </BaseDialog>
      )}
    </>
  );
};
