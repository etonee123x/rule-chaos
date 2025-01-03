import classNames from 'classnames';
import type { FC, HTMLAttributes, PropsWithChildren } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {}

export const BasePage: FC<Props> = ({ className, children }) => (
  <div className={classNames(['py-6', className])}>{children}</div>
);
