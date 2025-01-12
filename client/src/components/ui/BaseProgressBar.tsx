import classNames from 'classnames';
import { useMemo, type FC, type HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  value: number | null;
  isProgressInverted?: boolean;
}

export const BaseProgressBar: FC<Props> = ({ value: _value, className, isProgressInverted }) => {
  const value = useMemo(() => (isProgressInverted ? 1 - (_value ?? 0) : (_value ?? 0)), [_value, isProgressInverted]);

  return (
    <div className={classNames(className, 'progress-bar')}>
      <div style={{ width: `${value * 100}%` }} className="h-full bg-primary-500" />
    </div>
  );
};
