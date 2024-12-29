import classNames from 'classnames';
import { useRef, type FC, type InputHTMLAttributes, type PropsWithChildren } from 'react';
import { BaseIcon } from './BaseIcon';
import { pick } from '@/utils/pick';
import { UI } from '@/helpers/ui';
import { mdiCheckboxBlank, mdiCheckboxMarked } from '@mdi/js';

interface Props extends InputHTMLAttributes<HTMLInputElement>, PropsWithChildren {}

export const BaseCheckbox: FC<Props> = (props) => {
  const input = useRef<HTMLInputElement>(null);

  const onClick = () => {
    if (props.disabled || props.readOnly) {
      return;
    }

    input.current?.click();
  };

  const iconPath = props.checked ? mdiCheckboxMarked : mdiCheckboxBlank;

  const value = props.value ?? 'true';

  return (
    <div className={classNames(['group/checkbox', UI.CHECKBOX._name])} onClick={onClick}>
      <BaseIcon
        className="group-has-[input:focus]/checkbox:outline group-has-[input:focus]/checkbox:outline-2 group-has-[input:focus]/checkbox:outline-black rounded-xs"
        path={iconPath}
      />
      <input
        type="checkbox"
        className="sr-only"
        {...pick(props, ['disabled', 'readOnly', 'name', 'onChange', 'checked'])}
        value={value}
        ref={input}
      />
      {props.children && <label className="text-initial cursor-inherit">{props.children}</label>}
    </div>
  );
};
