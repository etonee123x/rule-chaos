import { type InputHTMLAttributes, type ReactNode } from 'react';
import { BaseIcon } from '@/components/ui/BaseIcon';
import { mdiClose } from '@mdi/js';

export interface Props
  extends Pick<
      InputHTMLAttributes<HTMLInputElement>,
      'value' | 'placeholder' | 'onFocus' | 'onBlur' | 'id' | 'disabled'
    >,
    Partial<{
      readonly: InputHTMLAttributes<HTMLInputElement>['readOnly'];
      children: ReactNode;
      onChange: (value: string) => void;
    }> {}

export const TextInputBase = ({
  value,
  placeholder,
  id,
  disabled,
  readonly,
  onChange,
  onFocus,
  onBlur,
  children,
}: Props) => {
  const onClickButtonClear = () => onChange?.('');

  return (
    <div className="text-input-base group">
      <input
        type="text"
        id={id}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readonly}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <div className="-me-3 flex items-center justify-center">
        {children ?? (
          <button
            tabIndex={-1}
            className="hidden active:block group-has-[input:focus]:group-has-[input:read-only]:hidden group-has-[input:focus]:block cursor-pointer"
            onClick={onClickButtonClear}
          >
            <BaseIcon path={mdiClose} />
          </button>
        )}
      </div>
    </div>
  );
};
