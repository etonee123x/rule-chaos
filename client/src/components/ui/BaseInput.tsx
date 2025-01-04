import { forwardRef, useId, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import {
  TextInputWrapper,
  type Props as PropsTextInputWrapper,
} from '@/components/ui/_TextLikeInputElements/TextInputWrapper';
import { TextInputBase, type Props as PropsTextInputBase } from '@/components/ui/_TextLikeInputElements/TextInputBase';

export interface Props
  extends PropsTextInputWrapper,
    PropsTextInputBase,
    Partial<{
      isLoading: boolean;
      childrenEnd: ReactNode;
    }> {}

export interface BaseInput extends TextInputBase {}

export const BaseInput = forwardRef<BaseInput, Props>(
  (
    {
      id: _id,
      type,
      min,
      max,
      step,
      disabled,
      isLoading,
      label,
      message,
      childrenBottom,
      childrenEnd,
      required,
      readOnly,
      value,
      name,
      onChange,
      onInput,
      pattern,
    },
    ref,
  ) => {
    const __id = useId();
    const id = _id ?? __id;
    const isDisabled = disabled || isLoading;

    const refTextInputBase = useRef<TextInputBase>(null);

    const [validationMessage, setValidationMessage] = useState('');

    useImperativeHandle(ref, () => ({
      setCustomValidity: (error) => {
        refTextInputBase.current?.setCustomValidity(error);
        setValidationMessage(error);
      },
      validity: refTextInputBase.current?.validity,
      input: refTextInputBase.current?.input ?? null,
    }));

    return (
      <TextInputWrapper {...{ validationMessage, label, message, childrenBottom, labelFor: id }}>
        <TextInputBase
          {...{
            ref: refTextInputBase,
            id,
            required,
            readOnly,
            value,
            onChange,
            onInput,
            pattern,
            disabled: isDisabled,
            name,
            type,
            min,
            max,
            step,
          }}
        >
          {childrenEnd}
        </TextInputBase>
      </TextInputWrapper>
    );
  },
);

BaseInput.displayName = 'BaseInput';
