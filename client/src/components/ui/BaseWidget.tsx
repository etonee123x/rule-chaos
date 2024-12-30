import type { FC, PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {}

export const BaseWidget: FC<Props> = (props) => <div>{props.children}</div>;
