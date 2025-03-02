import type { FunctionCallback } from '../types';
import { useDraggable, useElementBounding, useWindowSize } from '@reactuses/core';
import classNames from 'classnames';
import { useEffect, useMemo, useRef, type FC, type HTMLAttributes, type PropsWithChildren } from 'react';

export interface Props extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  onClick: FunctionCallback;
}

const MARGIN = 8;

export const BaseWidget: FC<Props> = ({ className, children, onClick }) => {
  const refRoot = useRef<HTMLDivElement>(null);

  const [x, y, , setPosition] = useDraggable(refRoot, {
    exact: true,
    initialValue: { x: MARGIN, y: MARGIN },
  });

  const { width: windowInnerWidth, height: windowInnerHeight } = useWindowSize();
  const { width: elementWidth, height: elementHeight } = useElementBounding(refRoot);

  const screenBounds = useMemo(
    () => ({
      top: MARGIN,
      right: windowInnerWidth - MARGIN,
      bottom: windowInnerHeight - MARGIN,
      left: MARGIN,
    }),
    [windowInnerWidth, windowInnerHeight],
  );

  const isOutOfBound = useMemo(
    () => ({
      top: y < screenBounds.top,
      right: x + elementWidth > screenBounds.right,
      bottom: y + elementHeight > screenBounds.bottom,
      left: x < screenBounds.left,
    }),
    [y, x, elementWidth, elementHeight, screenBounds],
  );

  useEffect(() => {
    let _x: number | undefined, _y: number | undefined;

    if (isOutOfBound.top) {
      // console.log('top');
      _y ??= screenBounds.top;
    }

    if (isOutOfBound.right) {
      // console.log('right');
      _x ??= screenBounds.right - elementWidth;
    }

    if (isOutOfBound.bottom) {
      // console.log('bottom');
      _y ??= screenBounds.bottom - elementHeight;
    }

    if (isOutOfBound.left) {
      // console.log('left');
      _x ??= screenBounds.left;
    }

    _x ??= x;
    _y ??= y;

    setPosition({ x: _x, y: _y });
  }, [x, y, isOutOfBound, screenBounds, elementWidth, elementHeight, setPosition]);

  const onClickButton = onClick;

  return (
    <div style={{ left: x, top: y }} className={classNames(['widget', className])} ref={refRoot}>
      <button onClick={onClickButton}>{children}</button>
    </div>
  );
};
