import { post } from '@/api/sessions';
import { BaseButton } from '@rule-chaos/components/BaseButton';
import { BaseCheckbox } from '@rule-chaos/components/BaseCheckbox';
import { BaseForm } from '@rule-chaos/components/BaseForm';
import { useAsyncData } from '@/hooks/useAsyncData';
import { mdiPlus } from '@mdi/js';
import { useCallback, useRef, useState, type FC, type HTMLAttributes } from 'react';
import { type Session } from '@/api/sessions';
import classNames from 'classnames';
import { BaseInput } from '@rule-chaos/components/BaseInput';
import { UI } from '@rule-chaos/helpers/ui';

export interface Props extends HTMLAttributes<HTMLDivElement>, Partial<{
  onPost: (session: Session) => unknown;
}> {}

export const FormCreateSession: FC<Props> = ({ onPost, ...restProps }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [isPrivate, setIsPrivate] = useState(false);
  const [hasTurnTimeLimit, setHasTurnTimeLimit] = useState(false);
  const [turnTimeLimit, setTurnTimeLimit] = useState(30);
  const [maxPlayersNumber, setMaxPlayersNumber] = useState(8);
  const [itemsPerPlayer, setItemsPerPlayer] = useState(5);

  const { execute: postSession } = useAsyncData(post);

  const refForm = useRef<BaseForm>(null);
  const refInputTurnTimeLimit = useRef<BaseInput>(null);
  const refInputMaxPlayersNumber = useRef<BaseInput>(null);
  const refInputItemsPerPlayer = useRef<BaseInput>(null);

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
    maxPlayersNumber: () => {
      const { valueMissing, stepMismatch, rangeOverflow, rangeUnderflow } =
        refInputMaxPlayersNumber.current?.validity ?? {};

      switch (true) {
        case valueMissing:
          return refInputMaxPlayersNumber.current?.setCustomValidity('Значение обязательно');
        case stepMismatch:
          return refInputMaxPlayersNumber.current?.setCustomValidity(
            `Должно быть кратно ${refInputMaxPlayersNumber.current.input?.step}`,
          );
        case rangeOverflow || rangeUnderflow:
          return refInputMaxPlayersNumber.current?.setCustomValidity(
            `Должно быть от ${refInputMaxPlayersNumber.current.input?.min} до ${refInputMaxPlayersNumber.current.input?.max}`,
          );
        default:
          return refInputMaxPlayersNumber.current?.setCustomValidity('');
      }
    },
    itemsPerPlayer: () => {
      const { valueMissing, stepMismatch, rangeOverflow, rangeUnderflow } =
        refInputItemsPerPlayer.current?.validity ?? {};

      switch (true) {
        case valueMissing:
          return refInputItemsPerPlayer.current?.setCustomValidity('Значение обязательно');
        case stepMismatch:
          return refInputItemsPerPlayer.current?.setCustomValidity(
            `Должно быть кратно ${refInputItemsPerPlayer.current.input?.step}`,
          );
        case rangeOverflow || rangeUnderflow:
          return refInputItemsPerPlayer.current?.setCustomValidity(
            `Должно быть от ${refInputItemsPerPlayer.current.input?.min} до ${refInputItemsPerPlayer.current.input?.max}`,
          );
        default:
          return refInputItemsPerPlayer.current?.setCustomValidity('');
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

            <BaseInput
              ref={refInputMaxPlayersNumber}
              label="Макс. кол-во игроков"
              step={1}
              min={2}
              max={8}
              value={maxPlayersNumber}
              type="number"
              name="maxPlayersNumber"
              required
              onChange={(maxPlayersNumber) => setMaxPlayersNumber(Number(maxPlayersNumber))}
              onInput={validations.maxPlayersNumber}
            />

            <BaseInput
              ref={refInputItemsPerPlayer}
              label="Предметов на одного игрока"
              step={1}
              min={2}
              max={8}
              value={itemsPerPlayer}
              type="number"
              name="itemsPerPlayer"
              required
              onChange={(itemsPerPlayer) => setItemsPerPlayer(Number(itemsPerPlayer))}
              onInput={validations.itemsPerPlayer}
            />

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
