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

export interface BaseInputText extends TextInputBase {}

export const BaseInputText = forwardRef<BaseInputText, Props>(
  (
    {
      id: _id,
      disabled,
      isLoading,
      label,
      message,
      componentBottom,
      // TODO переименовать
      childrenEnd,
      required,
      readonly,
      value,
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
      <TextInputWrapper {...{ validationMessage, label, message, componentBottom }} labelFor={id}>
        <TextInputBase
          ref={refTextInputBase}
          {...{ id, required, readonly, value, onChange, onInput, pattern, disabled: isDisabled }}
        >
          {childrenEnd}
        </TextInputBase>
      </TextInputWrapper>
    );
  },
);

BaseInputText.displayName = 'BaseInputText';
