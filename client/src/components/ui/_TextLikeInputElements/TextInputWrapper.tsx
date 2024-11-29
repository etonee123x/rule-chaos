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

export const TextInputWrapper: FC<Props> = (props) => {
  const componentBottom = props.componentBottom ?? props.message;

  const hasError = Boolean(props.validationMessage?.length);

  return (
    <div>
      <div className={classNames(['relative', hasError ? 'text-red-500' : 'text-primary-400'])}>
        {props.label && (
          <label
            className={classNames([
              UI.ELEMENT_TITLE,
              'absolute z-10 -top-3 start-2 p-px before:bg-white before:w-[calc(100%+2px)] before:-start-px before:top-2 before:z-[-1] before:h-2 before:absolute',
            ])}
            htmlFor={props.labelFor}
          >
            {props.label}
          </label>
        )}
        {props.children}
        {hasError && (
          <div className="z-10 text-xs p-px absolute top-5.5 start-2 before:bg-white before:w-[calc(100%+2px)] before:-start-px before:top-1 before:z-[-1] before:h-2 before:absolute">
            {props.validationMessage}
          </div>
        )}
      </div>
      {componentBottom && <div className="h-5 mt-0.5 text-body-initial">{componentBottom}</div>}
    </div>
  );
};
