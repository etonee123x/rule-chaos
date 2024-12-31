import { BaseIcon } from '@/components/ui/BaseIcon';
import { BaseWidget } from '@/components/ui/BaseWidget';
import { useSession } from '@/contexts/sessionContext';
import { mdiBallotOutline } from '@mdi/js';
import { useCallback, useEffect, useState, type FC } from 'react';
import { BaseDialog } from '@/components/ui/BaseDialog';
import classNames from 'classnames';
import { BaseButton, type Props as PropsButton } from './ui/BaseButton';
import type { Voting as IVoting } from '@/helpers/voting';

interface VotingVariant {
  text: string;
  votesNumber: number | undefined;
  propsButton: PropsButton;
}

const VotingVariant: FC<{ votingVariant: VotingVariant }> = (props) => (
  <div className="flex-1">
    <div className="mb-2 font-semibold">{props.votingVariant.text}</div>
    <div className="mb-8 text-8xl">{props.votingVariant.votesNumber}</div>
    <BaseButton {...props.votingVariant.propsButton} className="w-full justify-center"></BaseButton>
  </div>
);

export const Voting: FC = () => {
  const { activeVoting } = useSession();

  const [isDialogOpen, setIsDialogOpen] = useState(Boolean(activeVoting));

  const onClickWidget = () => setIsDialogOpen(true);
  const onCloseDialog = () => setIsDialogOpen(false);

  const getVotingVariantPositive = useCallback<(activeVoting: IVoting) => VotingVariant>(
    (activeVoting) => ({
      text: 'ЗА',
      votesNumber: activeVoting.votesNumberPositive,
      propsButton: {
        onClick: () => {},
        children: 'За!',
      },
    }),
    [],
  );

  const getVotingVariantNegative = useCallback<(activeVoting: IVoting) => VotingVariant>(
    (activeVoting) => ({
      text: 'ПРОТИВ',
      votesNumber: activeVoting.votesNumberNegative,
      propsButton: {
        onClick: () => {},
        children: 'Против!',
      },
    }),
    [],
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
