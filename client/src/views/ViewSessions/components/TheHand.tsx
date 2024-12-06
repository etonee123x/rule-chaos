import type { Item } from '@/api/messages';
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
        <li key={index} className="min-h-20 min-w-20 border">
          <div>{item.text}</div>
        </li>
      ))}
    </ul>
  </div>
);
