import type { FunctionCallback } from '@/types';
import { isNotNil } from '@/utils/isNotNil';
import { useMutationObserver } from '@reactuses/core';
import { forwardRef, useImperativeHandle, useRef, useState, type HTMLAttributes, type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

interface Props
  extends HTMLAttributes<HTMLDialogElement>,
    PropsWithChildren,
    Partial<{
      title: string;
      onOpen: FunctionCallback;
      onClose: FunctionCallback;
      onBeforeClose: () => boolean | Promise<boolean>;
    }> {}

export interface BaseDialog {
  open: FunctionCallback;
  close: FunctionCallback;
  isOpened: boolean;
}

export const BaseDialog = forwardRef<BaseDialog, Props>((props, ref) => {
  const refDialog = useRef<HTMLDialogElement>(null);
  const [isOpened, setIsOpened] = useState(false);

  const close = async () => {
    if (!isOpened) {
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
  const onClickWrapper = close;

  useImperativeHandle(ref, () => ({
    open: () => {
      if (isOpened) {
        return;
      }

      refDialog.current?.showModal();
      props.onOpen?.();
    },
    close,
    isOpened,
  }));

  useMutationObserver(
    () => setIsOpened(refDialog.current?.hasAttribute('open') ?? false), //
    refDialog,
    {
      attributes: true,
      attributeFilter: ['open'],
    },
  );

  return createPortal(
    <div>
      <dialog className="peer max-h-160 overflow-y-auto" ref={refDialog} onClose={onClose} onCancel={onCancel}>
        <div>
          {isNotNil(props.title) && <div>{props.title}</div>}

          <div>{props.children}</div>
        </div>
      </dialog>
      <div className="inset-0 z-[-1] fixed hidden peer-open:block" onClick={onClickWrapper} />
    </div>,
    document.body,
  );
});

BaseDialog.displayName = 'BaseDialog';
