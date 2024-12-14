import type { HistoryRecord } from '@/helpers/message';
import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  history: Array<HistoryRecord>;
}

const historyRecordMessageToHTML = (historyRecordMessage: HistoryRecord['message']) =>
  `<span>${historyRecordMessage.replace(/{([^}]+)}/g, (...[, content]) => `<span class="text-primary-500">${content}</span>`)}</span>`;

export const TheHistoryFeed: FC<Props> = (props) => (
  <div className={classNames(props.className)}>
    <div className="sticky top-0 bg-white pb-2 text-xl">История:</div>
    {props.history.length === 0 ? (
      <div>Нету истории...</div>
    ) : (
      <ul>
        {props.history.map((historyRecord) => (
          <li key={historyRecord.id}>
            <span className="w-16 inline-block">
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
