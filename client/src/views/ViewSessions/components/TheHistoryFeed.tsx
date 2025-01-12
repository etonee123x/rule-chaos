import { useGameSession } from '@/contexts/gameSession';
import type { HistoryRecord } from '@/helpers/message';
import classNames from 'classnames';
import { forwardRef, type HTMLAttributes } from 'react';
import { TheOutOfRoundPanel, type Props as PropsTheOutOfRoundPanel } from './TheOutOfRoundPanel';

interface Props extends HTMLAttributes<HTMLDivElement>, PropsTheOutOfRoundPanel {}

const historyRecordMessageToHTML = (historyRecordMessage: HistoryRecord['message']) =>
  `<span>${historyRecordMessage.replace(/{([^}]+)}/g, (...[, content]) => `<span class="text-primary-500">${content}</span>`)}</span>`;

export const TheHistoryFeed = forwardRef<HTMLDivElement, Props>(({ className, onClickButtonStartRound }, ref) => {
  const { history, isRoundActive } = useGameSession();

  return (
    <div ref={ref} className={classNames(className)}>
      {history.length > 0 && (
        <ul className="*:mb-1 last:*:mb-0 mb-2">
          {history.map((historyRecord) => (
            <li key={historyRecord.id}>
              <span className="w-16 inline-block text-gray-500">
                {new Date(historyRecord.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </span>
              <span dangerouslySetInnerHTML={{ __html: historyRecordMessageToHTML(historyRecord.message) }} />
            </li>
          ))}
        </ul>
      )}
      {!isRoundActive && <TheOutOfRoundPanel onClickButtonStartRound={onClickButtonStartRound} />}
    </div>
  );
});

TheHistoryFeed.displayName = 'TheHistoryFeed';
