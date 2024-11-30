import type { ButtonHTMLAttributes, FC } from 'react';

import { BaseIcon, type Props as PropsIcon } from './BaseIcon';

import { UI } from '@/helpers/ui';
import { pick } from '@/utils/pick';
import classNames from 'classnames';

export interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Partial<{
      propsIconPrepend: PropsIcon;
      propsIconAppend: PropsIcon;
    }> {}

export const BaseButton: FC<Props> = (props) => (
  <button className={classNames([UI.BUTTON._name, props.className])} {...pick(props, ['disabled', 'type', 'onClick'])}>
    {props.propsIconPrepend && <BaseIcon className="me-1" {...props.propsIconPrepend} />}
    {props.children}
    {props.propsIconAppend && <BaseIcon className="ms-1" {...props.propsIconAppend} />}
  </button>
);
