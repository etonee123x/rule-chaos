import type { ButtonHTMLAttributes, FC } from 'react';

import { UI } from '@/helpers/ui';
import { pick } from '@/utils/pick';

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const BaseButton: FC<Props> = (props) => (
  <button className={UI.BUTTON._name} {...pick(props, ['disabled', 'type', 'onClick'])}>
    {props.children}
  </button>
);
