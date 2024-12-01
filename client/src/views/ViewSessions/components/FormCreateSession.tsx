import { post } from '@/api/sessions';
import { BaseButton } from '@/components/ui/BaseButton';
import { BaseCheckbox } from '@/components/ui/BaseCheckbox';
import { BaseForm } from '@/components/ui/BaseForm';
import { useAsyncData } from '@/hooks/useAsyncData';
import { mdiPlus } from '@mdi/js';
import { useCallback, useRef, useState, type FC, type HTMLAttributes } from 'react';
import { type Session } from '@/api/sessions';
import classNames from 'classnames';

export interface Props
  extends Partial<{
      onPost: (session: Session) => unknown;
    }>,
    HTMLAttributes<HTMLDivElement> {}

export const FormCreateSession: FC<Props> = ({ onPost, ...restProps }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const { execute: postSession } = useAsyncData(post);

  const refForm = useRef<BaseForm>(null);

  const onSubmit = useCallback(() => {
    if (!refForm.current?.form?.checkValidity()) {
      return;
    }

    postSession(new FormData(refForm.current.form)).then(onPost);
  }, [postSession, onPost]);

  return (
    <div className={classNames(restProps.className)}>
      {!isExpanded ? (
        <BaseButton propsIconPrepend={{ path: mdiPlus }} onClick={() => setIsExpanded(true)}>
          Создать
        </BaseButton>
      ) : (
        <BaseForm ref={refForm} onSubmit={onSubmit}>
          <BaseCheckbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} name="isPrivate">
            Только по ссылке
          </BaseCheckbox>
          <BaseButton>Создать</BaseButton>
        </BaseForm>
      )}
    </div>
  );
};
