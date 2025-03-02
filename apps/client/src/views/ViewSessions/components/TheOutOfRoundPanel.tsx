import { BaseButton } from '@rule-chaos/components/BaseButton';
import { BaseIcon } from '@rule-chaos/components/BaseIcon';
import { useGameSession } from '@/contexts/gameSession';
import type { FunctionCallback } from '@rule-chaos/types';
import { mdiLinkVariant } from '@mdi/js';
import { useClipboard } from '@/hooks/useClipboard';
import { type FC, type HtmlHTMLAttributes, type MouseEventHandler } from 'react';

export interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
  onClickButtonStartRound: FunctionCallback;
}

export const TheOutOfRoundPanel: FC<Props> = ({ onClickButtonStartRound, className }) => {
  const { players } = useGameSession();

  const [, copy] = useClipboard();

  const onClickA: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    const href = window.location.href;

    copy(href);
  };

  return (
    <div className={className}>
      {players.length > 1 ? (
        <BaseButton onClick={onClickButtonStartRound}>Начать раунд</BaseButton>
      ) : (
        <>
          <span className="text-xl">Ожидание игроков... </span>
          <a onClick={onClickA} className="inline-flex gap-1 items-center cursor-pointer">
            Ссылка
            <BaseIcon path={mdiLinkVariant} />
          </a>
        </>
      )}
    </div>
  );
};
