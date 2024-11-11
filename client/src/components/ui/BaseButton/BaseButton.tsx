import { UI } from '@/helpers/ui';
import type { MouseEventHandler, ReactNode } from 'react';

export interface Props
  extends Partial<{
    children: ReactNode;
    onClick: MouseEventHandler<HTMLButtonElement>;
  }> {}

export const BaseButton = ({ children, onClick }: Props) => (
  <button className={UI.BUTTON._name} onClick={onClick}>
    {children}
  </button>
);
