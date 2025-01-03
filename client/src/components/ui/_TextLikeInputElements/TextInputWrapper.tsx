import type { FC, PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames';

import { UI } from '@/helpers/ui';

export interface Props
  extends PropsWithChildren,
    Partial<{
      labelFor: HTMLLabelElement['htmlFor'];
      validationMessage: HTMLInputElement['validationMessage'];
      message: string;
      label: string;
      componentBottom: ReactNode;
    }> {}

export const TextInputWrapper: FC<Props> = ({
  componentBottom: _componentBottom,
  message,
  validationMessage,
  label,
  labelFor,
  children,
}) => {
  const componentBottom = _componentBottom ?? message;

  const hasError = Boolean(validationMessage?.length);

  return (
    <div>
      <div className={classNames(['relative', hasError ? 'text-red-500' : 'text-primary-400'])}>
        {label && (
          <label
            className={classNames([
              UI.ELEMENT_TITLE,
              'absolute z-10 -top-3 start-2 p-px before:bg-white before:w-[calc(100%+2px)] before:-start-px before:top-2 before:z-[-1] before:h-2 before:absolute',
            ])}
            htmlFor={labelFor}
          >
            {label}
          </label>
        )}
        {children}
        {hasError && (
          <div className="z-10 text-xs p-px absolute top-5.5 start-2 before:bg-white before:w-[calc(100%+2px)] before:-start-px before:top-1 before:z-[-1] before:h-2 before:absolute">
            {validationMessage}
          </div>
        )}
      </div>
      {componentBottom && <div className="h-5 mt-0.5 text-body-initial">{componentBottom}</div>}
    </div>
  );
};
