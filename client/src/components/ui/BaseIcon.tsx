import { UI } from '@/helpers/ui';
import type { FC, HTMLAttributes } from 'react';

export interface Props extends HTMLAttributes<SVGElement> {
  path: string;
}

export const BaseIcon: FC<Props> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={UI.ICON._name} viewBox="0 0 24 24">
    <path d={props.path} fill="currentColor" />
  </svg>
);
