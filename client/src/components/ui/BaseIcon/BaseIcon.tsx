import { UI } from '@/helpers/ui';

export interface Props {
  path: string;
}

export const BaseIcon = (props: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={UI.ICON._name} viewBox="0 0 24 24">
    <path d={props.path} fill="currentColor" />
  </svg>
);
