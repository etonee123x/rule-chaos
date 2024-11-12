import { useId, type ReactNode } from 'react';
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

export const BaseInputText = ({
  id: propsId,
  disabled,
  isLoading,
  errorMessage,
  message,
  label,
  readonly,
  componentBottom,
  childrenEnd,
  value,
  onChange,
}: Props) => {
  const id = useId();
  const isDisabled = disabled || isLoading;

  return (
    <TextInputWrapper
      label={label}
      labelFor={id}
      errorMessage={errorMessage}
      message={message}
      componentBottom={componentBottom}
    >
      <TextInputBase id={propsId ?? id} disabled={isDisabled} readonly={readonly} value={value} onChange={onChange}>
        {childrenEnd}
      </TextInputBase>
    </TextInputWrapper>
  );
};
