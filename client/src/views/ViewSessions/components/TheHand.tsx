import type { Item } from '@/helpers/message';
import { UI } from '@/helpers/ui';
import classNames from 'classnames';
import { type FC, type HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  items: Array<Item>;
}

export const TheHand: FC<Props> = (props) => (
  <div className={props.className}>
    <ul className={classNames(['flex gap-2 overflow-x-auto', UI.NO_SCROLLBAR])}>
      {props.items.map((item, index) => (
        <li key={index} className="size-16 border shrink-0 flex justify-center items-center cursor-pointer select-none">
          <div>{item.text}</div>
        </li>
      ))}
    </ul>
  </div>
);
