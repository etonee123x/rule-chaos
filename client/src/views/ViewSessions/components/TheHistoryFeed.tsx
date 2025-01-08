import { useGameSession } from '@/contexts/gameSession';
import type { HistoryRecord } from '@/helpers/message';
import classNames from 'classnames';
import { forwardRef, type HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const historyRecordMessageToHTML = (historyRecordMessage: HistoryRecord['message']) =>
  `<span>${historyRecordMessage.replace(/{([^}]+)}/g, (...[, content]) => `<span class="text-primary-500">${content}</span>`)}</span>`;

export const TheHistoryFeed = forwardRef<HTMLDivElement, Props>(({ className }, ref) => {
  const { history } = useGameSession();

  return (
    <div ref={ref} className={classNames(className)}>
      <div className="sticky top-0 bg-white pb-2 text-xl">История:</div>
      {history.length === 0 ? (
        <div>Нету истории...</div>
      ) : (
        <ul className="*:mb-1 last:*:mb-0">
          {history.map((historyRecord) => (
            <li key={historyRecord.id}>
              <span className="w-16 inline-block text-gray-500">
                {
                  //
                  new Date(historyRecord.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })
                }
              </span>
              <span dangerouslySetInnerHTML={{ __html: historyRecordMessageToHTML(historyRecord.message) }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

TheHistoryFeed.displayName = 'TheHistoryFeed';
