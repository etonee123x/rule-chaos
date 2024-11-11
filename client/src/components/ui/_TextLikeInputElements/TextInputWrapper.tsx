import { UI } from '@/helpers/ui';
import type { ReactNode } from 'react';

export interface Props
  extends Partial<{
    labelFor: HTMLLabelElement['htmlFor'];
    errorMessage: string;
    message: string;
    label: string;
    childrenBottom: ReactNode;
    children: ReactNode;
  }> {}

export const TextInputWrapper = ({ errorMessage, labelFor, message, label, childrenBottom, children }: Props) => {
  const maybeMessage = errorMessage ?? message;
  const hasError = Boolean(errorMessage?.length);

  return (
    <div className={['flex flex-col', hasError ? 'group has-error text-red-90' : 'text-blue-30'].join(' ')}>
      {label && (
        <label className={['mb-1', UI.ELEMENT_TITLE].join(' ')} htmlFor={labelFor}>
          {label}
        </label>
      )}
      {children}
      <div className="flex mt-1 h-3 gap-2 items-center text-3xs text-initial group-[.has-error]:text-red-90">
        {childrenBottom ?? maybeMessage}
      </div>
    </div>
  );
};
