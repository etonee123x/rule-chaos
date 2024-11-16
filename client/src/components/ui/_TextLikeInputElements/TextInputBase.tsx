import { forwardRef, useImperativeHandle, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { BaseIcon } from '@/components/ui/BaseIcon';
import { mdiClose } from '@mdi/js';
import { pick } from '@/utils/pick';

export interface Props
  extends Pick<
      InputHTMLAttributes<HTMLInputElement>,
      'value' | 'placeholder' | 'id' | 'disabled' | 'required' | 'pattern' | 'onFocus' | 'onBlur' | 'onInput'
    >,
    Partial<{
      readonly: InputHTMLAttributes<HTMLInputElement>['readOnly'];
      children: ReactNode;
      onChange: (value: string) => void;
    }> {}

export interface TextInputBase {
  setCustomValidity: HTMLInputElement['setCustomValidity'];
  validity: HTMLInputElement['validity'] | undefined;
  input: HTMLInputElement | null;
}

export const TextInputBase = forwardRef<TextInputBase, Props>((props, ref) => {
  const refInput = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    setCustomValidity: (message) => {
      if (!refInput.current) {
        return;
      }

      refInput.current.setCustomValidity(message);
      refInput.current.reportValidity();
    },

    validity: refInput.current?.validity,
    validationMessage: refInput.current?.validationMessage,
    input: refInput.current,
  }));

  const onClickButtonClear = () => {
    props.onChange?.('');
    refInput.current?.focus();
  };

  const onClickRoot = () => refInput.current?.focus();

  return (
    <div className="text-input-base group" onClick={onClickRoot}>
      <input
        size={1}
        ref={refInput}
        type="text"
        {...pick(props, [
          'id',
          'value',
          'placeholder',
          'required',
          'disabled',
          'onFocus',
          'onBlur',
          'onInput',
          'pattern',
        ])}
        readOnly={props.readonly}
        onChange={(e) => props.onChange?.(e.target.value)}
      />
      <div className="-me-1 flex items-center justify-center">
        {props.children ?? (
          <button
            tabIndex={-1}
            className="hidden text-body-initial active:block group-has-[input:focus]:group-has-[input:read-only]:hidden group-has-[input:focus]:block cursor-pointer"
            onClick={onClickButtonClear}
          >
            <BaseIcon path={mdiClose} />
          </button>
        )}
      </div>
    </div>
  );
});

TextInputBase.displayName = 'TextInputBase';
