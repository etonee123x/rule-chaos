import type { FormEventHandler, FC, PropsWithChildren, HTMLAttributes } from 'react';

import type { FunctionCallback } from '@/types';
import { invoke } from '@/utils/invoke';

interface Props
  extends HTMLAttributes<HTMLFormElement>,
    PropsWithChildren,
    Partial<{ validations: Record<string, FunctionCallback> }> {}

export const BaseForm: FC<Props> = (props) => {
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (props.validations) {
      Object.values(props.validations).forEach(invoke);
    }

    props.onSubmit?.(event);
  };

  return (
    <form onSubmit={onSubmit} noValidate onInvalid={(event) => event.preventDefault()}>
      {props.children}
    </form>
  );
};
