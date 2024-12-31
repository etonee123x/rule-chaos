import type { FunctionCallback } from '@/types';
import { isNotNil } from '@/utils/isNotNil';
import { useClickOutside } from '@reactuses/core';
import { useEffect, useRef, type FC, type HTMLAttributes, type PropsWithChildren } from 'react';
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

export const BaseDialog: FC<Props> = (props) => {
  const refDialog = useRef<HTMLDialogElement>(null);
  const refContent = useRef<HTMLDivElement>(null);

  const close = async () => {
    if (!props.open) {
      return;
    }

    if (props.onBeforeClose && (await props.onBeforeClose()) === false) {
      return;
    }

    refDialog.current?.close();
    props.onClose?.();
  };

  const onClose = close;
  const onCancel = close;

  useEffect(() => {
    if (!refDialog.current) {
      return;
    }

    if (props.open && !refDialog.current.open) {
      return refDialog.current.showModal();
    }

    if (!props.open && refDialog.current.open) {
      return refDialog.current.close();
    }
  }, [props]);

  useClickOutside(refContent, close);

  return createPortal(
    <dialog className="peer overflow-y-auto dialog" ref={refDialog} onClose={onClose} onCancel={onCancel}>
      <div ref={refContent} className="p-4">
        {isNotNil(props.title) && <div className="text-xl mb-4">{props.title}</div>}

        <div>{props.children}</div>
      </div>
    </dialog>,
    document.body,
  );
};
