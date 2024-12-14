/* eslint-disable */

import type { HistoryRecord } from '@/helpers/message';
import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  history: Array<HistoryRecord>;
}

const historyRecordToHTML = (historyRecord: HistoryRecord) => `
<div>
  <span class="w-16 inline-block">${new Date(historyRecord.timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
})}:</span>
  <span>${historyRecord.message.replace(/{([^}]+)}/g, (...[, content]) =>`<span class="text-primary-500">${content}</span>`)}</span>
</div>
`;

export const TheHistoryFeed: FC<Props> = (props) => (
  <div className={classNames(props.className)}>
    <div className="sticky top-0 bg-white pb-2 text-xl">История:</div>
    {props.history.length === 0 ? (
      <div>Нету истории...</div>
    ) : (
      <ul>
        {props.history.map((historyRecord) => (
          <li
            key={historyRecord.id}
            dangerouslySetInnerHTML={{ __html: historyRecordToHTML(historyRecord) }}
          />
        ))}
      </ul>
    )}
  </div>
);
