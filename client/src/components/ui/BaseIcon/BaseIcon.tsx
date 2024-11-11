import { UI } from '@/helpers/ui';

export const BaseIcon = ({ path }: { path: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={UI.ICON._name} viewBox="0 0 24 24">
    <path d={path} fill="currentColor" />
  </svg>
);
