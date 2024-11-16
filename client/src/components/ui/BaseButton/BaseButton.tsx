import type { ButtonHTMLAttributes, FC } from 'react';

import { UI } from '@/helpers/ui';

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const BaseButton: FC<Props> = (props) => (
  <button className={UI.BUTTON._name} type={props.type} onClick={props.onClick}>
    {props.children}
  </button>
);
