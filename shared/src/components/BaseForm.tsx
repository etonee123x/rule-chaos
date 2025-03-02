import {
  type FormEventHandler,
  type PropsWithChildren,
  type HTMLAttributes,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

import type { FunctionCallback } from '@rule-chaos/types';
import { invoke } from '@/utils/invoke';

interface Props extends HTMLAttributes<HTMLFormElement>, PropsWithChildren, Partial<{
  validations: Record<string, FunctionCallback>
}> {}

export interface BaseForm {
  form: HTMLFormElement | null;
}

export const BaseForm = forwardRef<BaseForm, Props>(
  ({ validations, className, children, onSubmit: _onSubmit, onInvalid: _onInvalid }, ref) => {
    const refForm = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => ({
      form: refForm.current,
    }));

    const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
      event.preventDefault();

      if (validations) {
        Object.values(validations).forEach(invoke());
      }

      return _onSubmit?.(event);
    };

    const onInvalid: FormEventHandler<HTMLFormElement> = (event) => {
      event.preventDefault();

      return _onInvalid?.(event);
    };

    return (
      <form {...{ className, onInvalid, onSubmit }} ref={refForm} noValidate>
        {children}
      </form>
    );
  },
);

BaseForm.displayName = 'BaseForm';
