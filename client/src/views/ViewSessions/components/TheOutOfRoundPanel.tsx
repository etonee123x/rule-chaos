import { BaseButton } from '@/components/ui/BaseButton';
import { BaseIcon } from '@/components/ui/BaseIcon';
import { useSession } from '@/contexts/sessionContext';
import type { FunctionCallback } from '@/types';
import { mdiLinkVariant } from '@mdi/js';
import { useClipboard } from '@reactuses/core';
import { type FC, type MouseEventHandler } from 'react';

interface Props {
  onClickButtonStartRound: FunctionCallback;
}

export const TheOutOfRoundPanel: FC<Props> = (props) => {
  const { playersInSession } = useSession();

  const [, copy] = useClipboard();

  const onClickA: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();

    copy(window.location.href);
  };

  return (
    <div>
      {playersInSession.length > 1 ? (
        <BaseButton onClick={props.onClickButtonStartRound}>Начать раунд</BaseButton>
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
