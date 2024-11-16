import { UI } from '@/helpers/ui';
import type { ReactNode } from 'react';

export interface Props
  extends Partial<{
    labelFor: HTMLLabelElement['htmlFor'];
    validationMessage: HTMLInputElement['validationMessage'];
    message: string;
    label: string;
    componentBottom: ReactNode;
    children: ReactNode;
  }> {}

export const TextInputWrapper = (props: Props) => {
  const componentBottom = props.componentBottom ?? props.message;

  const hasError = Boolean(props.validationMessage?.length);

  return (
    <div className={['flex flex-col gap-0.5 relative', hasError ? 'text-red-500' : 'text-primary-400'].join(' ')}>
      {props.label && (
        <label
          className={[
            UI.ELEMENT_TITLE,
            'absolute z-10 -top-3 start-2 p-px before:bg-white before:w-[calc(100%+2px)] before:-start-px before:top-2 before:z-[-1] before:h-2 before:absolute',
          ].join(' ')}
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
      {componentBottom && <div className="h-5 text-body-initial">{componentBottom}</div>}
    </div>
  );
};
