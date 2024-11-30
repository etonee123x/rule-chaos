import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';

import { UI } from '@/helpers/ui';
import { pick } from '@/utils/pick';
import classNames from 'classnames';

export interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Partial<{
      childrenPrepend: ReactNode;
      childrenAppend: ReactNode;
    }> {}

export const BaseButton: FC<Props> = (props) => (
  <button className={classNames([UI.BUTTON._name, props.className])} {...pick(props, ['disabled', 'type', 'onClick'])}>
    {props.childrenPrepend}
    {props.children}
    {props.childrenAppend}
  </button>
);
