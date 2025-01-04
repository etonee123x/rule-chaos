import { post } from '@/api/sessions';
import { BaseButton } from '@/components/ui/BaseButton';
import { BaseCheckbox } from '@/components/ui/BaseCheckbox';
import { BaseForm } from '@/components/ui/BaseForm';
import { useAsyncData } from '@/hooks/useAsyncData';
import { mdiPlus } from '@mdi/js';
import { useCallback, useRef, useState, type FC, type HTMLAttributes } from 'react';
import { type Session } from '@/api/sessions';
import classNames from 'classnames';
import { BaseInput } from '@/components/ui/BaseInput';
import { UI } from '@/helpers/ui';

export interface Props
  extends Partial<{
      onPost: (session: Session) => unknown;
    }>,
    HTMLAttributes<HTMLDivElement> {}

export const FormCreateSession: FC<Props> = ({ onPost, ...restProps }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [isPrivate, setIsPrivate] = useState(false);
  const [hasTurnTimeLimit, setHasTurnTimeLimit] = useState(false);
  const [turnTimeLimit, setTurnTimeLimit] = useState<number | null>(null);

  const { execute: postSession } = useAsyncData(post);

  const refForm = useRef<BaseForm>(null);
  const refInputTurnTimeLimit = useRef<BaseInput>(null);

  const onSubmit = useCallback(() => {
    if (!refForm.current?.form?.checkValidity()) {
      return;
    }

    postSession(new FormData(refForm.current.form)).then(onPost);
  }, [postSession, onPost]);

  const onClickReset = () => setIsExpanded(false);
  const onClickCreate = () => setIsExpanded(true);

  const validations = {
    turnTimeLimit: () => {
      const { valueMissing, stepMismatch, rangeOverflow, rangeUnderflow } =
        refInputTurnTimeLimit.current?.validity ?? {};

      switch (true) {
        case valueMissing:
          return refInputTurnTimeLimit.current?.setCustomValidity('Значение обязательно');
        case stepMismatch:
          return refInputTurnTimeLimit.current?.setCustomValidity(
            `Должно быть кратно ${refInputTurnTimeLimit.current.input?.step}`,
          );
        case rangeOverflow || rangeUnderflow:
          return refInputTurnTimeLimit.current?.setCustomValidity(
            `Должно быть от ${refInputTurnTimeLimit.current.input?.min} до ${refInputTurnTimeLimit.current.input?.max}`,
          );
        default:
          return refInputTurnTimeLimit.current?.setCustomValidity('');
      }
    },
  };

  return (
    <div className={classNames(restProps.className)}>
      {!isExpanded ? (
        <BaseButton propsIconPrepend={{ path: mdiPlus }} onClick={onClickCreate}>
          Создать
        </BaseButton>
      ) : (
        <BaseForm
          validations={validations}
          ref={refForm}
          onSubmit={onSubmit}
          className="p-4 bg-gray-100 rounded-lg w-fit"
        >
          <div className="flex flex-col gap-4">
            <BaseCheckbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} name="isPrivate">
              Только по ссылке
            </BaseCheckbox>
            <div className="flex gap-4 h-10 items-center">
              <BaseCheckbox
                checked={hasTurnTimeLimit}
                onChange={(e) => setHasTurnTimeLimit(e.target.checked)}
                name="hasTurnTimeLimit"
              >
                С ограничением по времени
              </BaseCheckbox>
              {hasTurnTimeLimit && (
                <BaseInput
                  ref={refInputTurnTimeLimit}
                  label="Время хода в секундах"
                  step={10}
                  min={10}
                  max={300}
                  value={turnTimeLimit}
                  type="number"
                  name="turnTimeLimit"
                  required
                  onChange={(turnTimeLimit) => setTurnTimeLimit(Number(turnTimeLimit))}
                  onInput={validations.turnTimeLimit}
                />
              )}
            </div>
            <div className="flex gap-4">
              <BaseButton className="flex-1">Создать</BaseButton>
              <BaseButton type="reset" onClick={onClickReset} className={UI.BUTTON.THEME.SECONDARY}>
                Отмена
              </BaseButton>
            </div>
          </div>
        </BaseForm>
      )}
    </div>
  );
};
