import { useRef, useState, type FormEventHandler } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { open, close, isOpened } from '@/api/websocket';
import { BaseButton, type Props as PropsBaseButton } from '@/components/ui/BaseButton';
import { BaseInputText } from '@/components/ui/BaseInputText';
import { BaseForm } from '@/components/ui/BaseForm';
import { ROUTER_ID_TO_PATH_BUILDER } from '@/router';

export const FormSessionConnection = () => {
  const { sessionCode: paramsSessionCode, playerName: paramsPlayerName } = useParams();

  const [sessionCode, setSessionCode] = useState(paramsSessionCode ?? '');
  const [playerName, setPlayerName] = useState(paramsPlayerName ?? '');

  const refInputSessionCode = useRef<BaseInputText>(null);
  const refInputPlayerName = useRef<BaseInputText>(null);
  const refForm = useRef<BaseForm>(null);

  const model = {
    sessionCode,
    playerName,
  };

  const resetModel = () => {
    setSessionCode('');
    setPlayerName('');
  };

  const isConnected = isOpened();

  const { PLAY_WITH_SESSION_CODE, PLAY } = ROUTER_ID_TO_PATH_BUILDER;

  const navigate = useNavigate();

  const onChangeSessionCode = setSessionCode;
  const onChangePlayerName = setPlayerName;

  const onSubmit: FormEventHandler<HTMLFormElement> = () => {
    if (!refForm.current?.form?.checkValidity()) {
      return;
    }

    open(model.sessionCode, model.playerName).then(() => navigate(PLAY_WITH_SESSION_CODE(sessionCode)));
  };

  const onClickExit: PropsBaseButton['onClick'] = (event) => {
    event.preventDefault();

    close();
    resetModel();
    navigate(PLAY());
  };

  const validations = {
    sessionCode: () => {
      const { valueMissing, patternMismatch } = refInputSessionCode.current?.validity ?? {};

      switch (true) {
        case valueMissing:
          return refInputSessionCode.current?.setCustomValidity('A где блядь?');
        case patternMismatch:
          return refInputSessionCode.current?.setCustomValidity('Не то чото(');
        default:
          return refInputSessionCode.current?.setCustomValidity('');
      }
    },
    playerName: () => {
      const { valueMissing, patternMismatch } = refInputPlayerName.current?.validity ?? {};

      switch (true) {
        case valueMissing:
          return refInputPlayerName.current?.setCustomValidity('A где блядь?');
        case patternMismatch:
          return refInputPlayerName.current?.setCustomValidity('Не то чото(');
        default:
          return refInputPlayerName.current?.setCustomValidity('');
      }
    },
  };

  return (
    <BaseForm ref={refForm} className="flex gap-4" onSubmit={onSubmit} validations={validations}>
      <BaseInputText
        ref={refInputSessionCode}
        readonly={isConnected}
        required
        label="Код сессии"
        pattern="\w(?:.*\w)?"
        value={model.sessionCode}
        onChange={onChangeSessionCode}
        onInput={validations.sessionCode}
      />
      <BaseInputText
        ref={refInputPlayerName}
        readonly={isConnected}
        required
        label="Имя"
        pattern="\w(?:.*\w)?"
        value={model.playerName}
        onChange={onChangePlayerName}
        onInput={validations.playerName}
      />
      {isConnected ? (
        <BaseButton type="reset" onClick={onClickExit}>
          Выйти
        </BaseButton>
      ) : (
        <BaseButton>Подключиться</BaseButton>
      )}
    </BaseForm>
  );
};
