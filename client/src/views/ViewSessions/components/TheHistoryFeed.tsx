import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const TheHistoryFeed: FC<Props> = (props) => (
  <div className={classNames(props.className)}>
    <div className="sticky top-0 bg-white pb-2 text-xl">История:</div>
    <ul>
      <li>история такая</li>
    </ul>
  </div>
);
