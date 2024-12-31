import { BaseIcon } from '@/components/ui/BaseIcon';
import { BaseWidget } from '@/components/ui/BaseWidget';
import { useSession } from '@/contexts/sessionContext';
import { mdiBallotOutline } from '@mdi/js';
import { useRef, type FC } from 'react';
import { BaseDialog } from './ui/BaseDialog';

export const Voting: FC = () => {
  const { activeVoting } = useSession();

  const refDialog = useRef<BaseDialog>(null);

  const onClick = () => refDialog.current?.open();

  return (
    <>
      {!refDialog.current?.isOpened && (
        <BaseWidget onClick={onClick}>
          <BaseIcon path={mdiBallotOutline} />
        </BaseWidget>
      )}
      <BaseDialog ref={refDialog} title={activeVoting?.title}>
        <pre>{JSON.stringify(activeVoting)}</pre>
      </BaseDialog>
    </>
  );
};
