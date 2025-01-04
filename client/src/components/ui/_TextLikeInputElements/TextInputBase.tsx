import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  type InputHTMLAttributes,
  type PropsWithChildren,
} from 'react';

import { BaseIcon } from '@/components/ui/BaseIcon';
import { mdiClose } from '@mdi/js';

export interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>,
    Partial<{
      onChange: (value: string) => void;
      value: InputHTMLAttributes<HTMLInputElement>['value'] | null;
    }>,
    PropsWithChildren {}

export interface TextInputBase {
  setCustomValidity: HTMLInputElement['setCustomValidity'];
  validity: HTMLInputElement['validity'] | undefined;
  input: HTMLInputElement | null;
}

export const TextInputBase = forwardRef<TextInputBase, Props>(
  (
    {
      id,
      value,
      placeholder,
      required,
      readOnly,
      disabled,
      onFocus,
      onBlur,
      onInput,
      pattern,
      children,
      onChange,
      name,
      min,
      max,
      step,
      type: _type,
    },
    ref,
  ) => {
    const type = useMemo(() => _type ?? 'text', [_type]);

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
      onChange?.('');
      refInput.current?.focus();
    };

    const onClickRoot = () => refInput.current?.focus();

    return (
      <div className="text-input-base group" onClick={onClickRoot}>
        <input
          {...{
            size: 1,
            type,
            ref: refInput,
            id,
            value: value ?? undefined,
            placeholder,
            required,
            disabled,
            onFocus,
            onBlur,
            onInput,
            pattern,
            readOnly,
            name,
            min,
            max,
            step,
            onChange: (e) => onChange?.(e.target.value),
          }}
        />
        <div className="-me-1 flex items-center justify-center">
          {children ?? (
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
  },
);

TextInputBase.displayName = 'TextInputBase';
