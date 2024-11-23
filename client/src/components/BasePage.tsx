import type { FC, HTMLAttributes, PropsWithChildren } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {}

export const BasePage: FC<Props> = (props) => <div className="py-6">{props.children}</div>;
