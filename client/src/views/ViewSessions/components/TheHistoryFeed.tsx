import type { History } from '@/helpers/message';
import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  history: History;
}

export const TheHistoryFeed: FC<Props> = (props) => (
  <div className={classNames(props.className)}>
    <div className="sticky top-0 bg-white pb-2 text-xl">История:</div>
    {props.history.length === 0 ? (
      <div>Нету истории...</div>
    ) : (
      <ul>
        {props.history.map((historyRecord, index) => (
          <li key={index}>{historyRecord}</li>
        ))}
      </ul>
    )}
  </div>
);
