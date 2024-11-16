import { forwardRef, useId, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import {
  TextInputWrapper,
  type Props as PropsTextInputWrapper,
} from '@/components/ui/_TextLikeInputElements/TextInputWrapper';
import { TextInputBase, type Props as PropsTextInputBase } from '@/components/ui/_TextLikeInputElements/TextInputBase';
import { pick } from '@/utils/pick';

export interface Props
  extends PropsTextInputWrapper,
    PropsTextInputBase,
    Partial<{
      isLoading: boolean;
      childrenEnd: ReactNode;
    }> {}

export interface BaseInputText extends TextInputBase {}

export const BaseInputText = forwardRef<BaseInputText, Props>((props, ref) => {
  const _id = useId();
  const id = props.id ?? _id;
  const isDisabled = props.disabled || props.isLoading;

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
    <TextInputWrapper
      {...pick(props, ['label', 'message', 'componentBottom'])}
      {...{ validationMessage }}
      labelFor={id}
    >
      <TextInputBase
        ref={refTextInputBase}
        id={id}
        disabled={isDisabled}
        {...pick(props, ['required', 'readonly', 'value', 'onChange', 'onInput', 'pattern'])}
      >
        {props.childrenEnd}
      </TextInputBase>
    </TextInputWrapper>
  );
});

BaseInputText.displayName = 'BaseInputText';
