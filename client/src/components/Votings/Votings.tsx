import { BaseIcon } from '@/components/ui/BaseIcon';
import { BaseWidget } from '@/components/ui/BaseWidget';
import { useGameSession } from '@/contexts/gameSession';
import { mdiBallotOutline } from '@mdi/js';
import { useEffect, useState, type FC } from 'react';
import { BaseDialog } from '@/components/ui/BaseDialog';
import classNames from 'classnames';
import { isNotNil } from '@/utils/isNotNil';
import { BaseProgressBar } from '@/components/ui/BaseProgressBar';
import { useActiveVotingCountDown } from '@/hooks/useActiveVotingCountdown';
import { VotingActive, type Props as PropsVotingActive } from './VotingActive';

interface Props extends PropsVotingActive {}

export const Votings: FC<Props> = ({ onClickVoteNegative, onClickVotePositive }) => {
  const { activeVoting } = useGameSession();

  const { partPassed } = useActiveVotingCountDown();

  const [isDialogOpen, setIsDialogOpen] = useState(Boolean(activeVoting));

  const onClickWidget = () => setIsDialogOpen(true);
  const onCloseDialog = () => setIsDialogOpen(false);

  useEffect(() => setIsDialogOpen(Boolean(activeVoting)), [activeVoting]);

  return (
    <>
      <BaseWidget className={classNames(isDialogOpen && 'hidden')} onClick={onClickWidget}>
        <BaseIcon path={mdiBallotOutline} />
        {isNotNil(partPassed) && (
          <BaseProgressBar className="h-1 absolute bottom-0 start-0 pointer-events-none" value={partPassed} />
        )}
      </BaseWidget>

      <BaseDialog open={isDialogOpen} onClose={onCloseDialog}>
        <VotingActive onClickVoteNegative={onClickVoteNegative} onClickVotePositive={onClickVotePositive} />
      </BaseDialog>
    </>
  );
};
