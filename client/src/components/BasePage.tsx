import classNames from 'classnames';
import type { FC, HTMLAttributes, PropsWithChildren } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {}

export const BasePage: FC<Props> = (props) => (
  <div className={classNames(['py-6', props.className])}>{props.children}</div>
);
