import {
  type FormEventHandler,
  type PropsWithChildren,
  type HTMLAttributes,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

import type { FunctionCallback } from '@/types';
import { invoke } from '@/utils/invoke';

interface Props
  extends HTMLAttributes<HTMLFormElement>,
    PropsWithChildren,
    Partial<{ validations: Record<string, FunctionCallback> }> {}

export interface BaseForm {
  form: HTMLFormElement | null;
}

export const BaseForm = forwardRef<BaseForm, Props>((props, ref) => {
  const refForm = useRef<HTMLFormElement>(null);

  useImperativeHandle(ref, () => ({
    form: refForm.current,
  }));

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (props.validations) {
      Object.values(props.validations).forEach(invoke);
    }

    return props.onSubmit?.(event);
  };

  const onInvalid: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    return props.onInvalid?.(event);
  };

  return (
    <form {...props} ref={refForm} noValidate onInvalid={onInvalid} onSubmit={onSubmit}>
      {props.children}
    </form>
  );
});

BaseForm.displayName = 'BaseForm';
