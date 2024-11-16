import { UI } from '@/helpers/ui';
import type { MouseEventHandler, ReactNode } from 'react';

export interface Props
  extends Partial<{
    type: HTMLButtonElement['type'];
    children: ReactNode;
    onClick: MouseEventHandler<HTMLButtonElement>;
  }> {}

export const BaseButton = (props: Props) => (
  <button className={UI.BUTTON._name} type={props.type} onClick={props.onClick}>
    {props.children}
  </button>
);
