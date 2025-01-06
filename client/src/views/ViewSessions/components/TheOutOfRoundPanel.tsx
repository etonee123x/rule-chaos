import { BaseButton } from '@/components/ui/BaseButton';
import { BaseIcon } from '@/components/ui/BaseIcon';
import { useSession } from '@/contexts/sessionContext';
import type { FunctionCallback } from '@/types';
import { mdiLinkVariant } from '@mdi/js';
import { useClipboard } from '@/hooks/useClipboard';
import { type FC, type MouseEventHandler } from 'react';

interface Props {
  onClickButtonStartRound: FunctionCallback;
}

export const TheOutOfRoundPanel: FC<Props> = ({ onClickButtonStartRound }) => {
  const { players } = useSession();

  const [, copy] = useClipboard();

  const onClickA: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    const href = window.location.href;

    copy(href);
  };

  return (
    <div>
      {players.length > 1 ? (
        <BaseButton onClick={onClickButtonStartRound}>Начать раунд</BaseButton>
      ) : (
        <div>
          <div className="text-xl mb-2">Ожидание игроков...</div>
          <a onClick={onClickA} className="flex gap-1 items-center cursor-pointer">
            Ссылка
            <BaseIcon path={mdiLinkVariant} />
          </a>
        </div>
      )}
    </div>
  );
};
