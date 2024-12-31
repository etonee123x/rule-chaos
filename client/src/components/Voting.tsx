import { BaseIcon } from '@/components/ui/BaseIcon';
import { BaseWidget } from '@/components/ui/BaseWidget';
import { useSession } from '@/contexts/sessionContext';
import { mdiBallotOutline } from '@mdi/js';
import { useEffect, useMemo, useState, type FC } from 'react';
import { BaseDialog } from '@/components/ui/BaseDialog';
import classNames from 'classnames';
import { BaseButton } from './ui/BaseButton';
import type { FunctionCallback } from '@/types';

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
      text: 'ЗА',
      votesNumber: activeVoting?.playersVotedPositiveIds.length ?? 0,
      shouldRenderButton: !playerVotedNegative,
      propsButton: {
        onClick: props.onVotePositive,
        children: 'За!',
      },
    },
    {
      id: 1,
      text: 'ПРОТИВ',
      votesNumber: activeVoting?.playersVotedNegativeIds.length ?? 0,
      shouldRenderButton: !playerVotedPositive,
      propsButton: {
        onClick: props.onVoteNegative,
        children: 'Против!',
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
                <div className="mb-8 text-8xl">{votingVariant.votesNumber}</div>
                {!playerVoted && <BaseButton {...votingVariant.propsButton} className="w-full justify-center" />}
              </div>
            ))}
            {playerVoted && <div>Ты уже проголосовал!</div>}
          </div>
        </BaseDialog>
      )}
    </>
  );
};
