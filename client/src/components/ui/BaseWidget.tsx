import type { FunctionCallback } from '@/types';
import { useDraggable } from '@reactuses/core';
import { useRef, type FC, type PropsWithChildren } from 'react';

export interface Props extends PropsWithChildren {
  onClick: FunctionCallback;
}

export const BaseWidget: FC<Props> = (props) => {
  const refRoot = useRef<HTMLDivElement>(null);

  const [x, y] = useDraggable(refRoot);

  const onClickButton = props.onClick;

  return (
    <div
      style={{
        position: 'fixed',
        cursor: 'move',
        zIndex: 10,
        touchAction: 'none',
        padding: 10,
        border: 'solid 1px',
        left: x,
        top: y,
      }}
      ref={refRoot}
    >
      <button onClick={onClickButton}>{props.children}</button>
    </div>
  );
};
