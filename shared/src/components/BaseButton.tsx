import type { ButtonHTMLAttributes, FC } from 'react';

import { BaseIcon, type Props as PropsIcon } from '@/components/BaseIcon';

import { UI } from '@/helpers/ui';
import classNames from 'classnames';

export interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement>, Partial<{
    propsIconPrepend: PropsIcon;
    propsIconAppend: PropsIcon;
  }> {}

export const BaseButton: FC<Props> = ({
  className,
  propsIconPrepend,
  propsIconAppend,
  disabled,
  type,
  children,
  onClick,
}) => (
  <button className={classNames([UI.BUTTON._name, className])} {...{ disabled, type, onClick }}>
    {propsIconPrepend && <BaseIcon {...propsIconPrepend} />}
    {children}
    {propsIconAppend && <BaseIcon {...propsIconAppend} />}
  </button>
);
