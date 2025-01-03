import type { FunctionCallback } from '@/types';
import { isNotNil } from '@/utils/isNotNil';
import { useClickOutside } from '@reactuses/core';
import { useEffect, useRef, type CSSProperties, type FC, type HTMLAttributes, type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

interface Props
  extends HTMLAttributes<HTMLDialogElement>,
    PropsWithChildren,
    Partial<{
      title: string;
      onOpen: FunctionCallback;
      onClose: FunctionCallback;
      onBeforeClose: () => boolean | Promise<boolean>;
    }> {
  open: boolean;
}

const STYLE = Object.freeze({ '--dialog-content--padding': '16px' }) as CSSProperties;

export const BaseDialog: FC<Props> = ({ open, title, children, onBeforeClose, onClose: _onClose }) => {
  const refDialog = useRef<HTMLDialogElement>(null);
  const refContent = useRef<HTMLDivElement>(null);

  const close = async () => {
    if (!open) {
      return;
    }

    if (onBeforeClose && (await onBeforeClose()) === false) {
      return;
    }

    refDialog.current?.close();
    _onClose?.();
  };

  const onClose = close;
  const onCancel = close;

  useEffect(() => {
    if (!refDialog.current) {
      return;
    }

    if (open && !refDialog.current.open) {
      return refDialog.current.showModal();
    }

    if (!open && refDialog.current.open) {
      return refDialog.current.close();
    }
  }, [open]);

  useClickOutside(refContent, close);

  return createPortal(
    <dialog className="peer overflow-y-auto dialog" ref={refDialog} onClose={onClose} onCancel={onCancel}>
      <div ref={refContent} style={STYLE} className="p-4">
        {isNotNil(title) && <div className="text-xl mb-4">{title}</div>}

        <div>{children}</div>
      </div>
    </dialog>,
    document.body,
  );
};
