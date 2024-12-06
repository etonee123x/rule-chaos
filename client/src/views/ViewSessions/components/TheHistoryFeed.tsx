import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const TheHistoryFeed: FC<Props> = (props) => (
  <div className={classNames(props.className)}>
    История:
    <ul></ul>
  </div>
);
