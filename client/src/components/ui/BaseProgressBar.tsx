import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  value: number;
}

export const BaseProgressBar: FC<Props> = ({ value, className }) => (
  <div className={classNames(className, 'progress-bar')}>
    <div style={{ width: `${value * 100}%` }} className="h-full bg-primary-500" />
  </div>
);
