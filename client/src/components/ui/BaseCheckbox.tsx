import classNames from 'classnames';
import { useRef, type FC, type InputHTMLAttributes, type PropsWithChildren } from 'react';
import { BaseIcon } from './BaseIcon';
import { UI } from '@/helpers/ui';
import { mdiCheckboxBlank, mdiCheckboxMarked } from '@mdi/js';

interface Props extends InputHTMLAttributes<HTMLInputElement>, PropsWithChildren {}

export const BaseCheckbox: FC<Props> = ({ disabled, readOnly, checked, value: _value, children, name, onChange }) => {
  const input = useRef<HTMLInputElement>(null);

  const onClick = () => {
    if (disabled || readOnly) {
      return;
    }

    input.current?.click();
  };

  const iconPath = checked ? mdiCheckboxMarked : mdiCheckboxBlank;

  const value = _value ?? 'true';

  return (
    <div className={classNames(['group/checkbox', UI.CHECKBOX._name])} onClick={onClick}>
      <BaseIcon
        className="group-has-[input:focus]/checkbox:outline group-has-[input:focus]/checkbox:outline-2 group-has-[input:focus]/checkbox:outline-black rounded-xs"
        path={iconPath}
      />
      <input
        type="checkbox"
        className="sr-only"
        {...{ disabled, readOnly, name, onChange, checked }}
        value={value}
        ref={input}
      />
      {children && <label className="text-initial cursor-inherit">{children}</label>}
    </div>
  );
};
