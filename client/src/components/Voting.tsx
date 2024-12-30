import { BaseIcon } from '@/components/ui/BaseIcon';
import { BaseWidget } from '@/components/ui/BaseWidget';
import { useSession } from '@/contexts/sessionContext';
import { mdiBallotOutline } from '@mdi/js';
import { useState, type FC } from 'react';

export const Voting: FC = () => {
  const { activeVoting } = useSession();

  const [isDialogOpened, setIsOpened] = useState(Boolean(activeVoting));

  const onClick = () => setIsOpened(true);

  return (
    <>
      {isDialogOpened ? (
        <pre>{JSON.stringify(activeVoting)}</pre>
      ) : (
        <BaseWidget onClick={onClick}>
          <BaseIcon path={mdiBallotOutline} />
        </BaseWidget>
      )}
    </>
  );
};
