import { useEffect, useRef, useState, type FC, type FormEventHandler } from 'react';
import { useSearchParams } from 'react-router-dom';

import { open, close, isOpened } from '@/api/websocket';
import { BaseButton, type Props as PropsBaseButton } from '@/components/ui/BaseButton';
import { BaseInputText } from '@/components/ui/BaseInputText';
import { BaseForm } from '@/components/ui/BaseForm';

export const FormSessionConnection: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [sessionCode, setSessionCode] = useState(searchParams.get('session_code') ?? '');
  const [playerName, setPlayerName] = useState(searchParams.get('player_name') ?? '');
  const [isConnected, setIsConnected] = useState(isOpened());

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

  useEffect(() => close, []);

  useEffect(() => {
    const maybePlayerName = searchParams.get('player_name');
    const maybeSessionCode = searchParams.get('session_code');

    if (!(maybePlayerName && maybeSessionCode)) {
      close();
      resetModel();
      setIsConnected(isOpened());

      return;
    }

    open(maybeSessionCode, maybePlayerName).then(() => setIsConnected(isOpened()));
  }, [searchParams]);

  const onChangeSessionCode = setSessionCode;
  const onChangePlayerName = setPlayerName;

  const onSubmit: FormEventHandler<HTMLFormElement> = () => {
    if (!refForm.current?.form?.checkValidity()) {
      return;
    }

    const urlSearchParams = new URLSearchParams();

    urlSearchParams.set('session_code', sessionCode);
    urlSearchParams.set('player_name', playerName);

    setSearchParams(urlSearchParams);
  };

  const onClickExit: PropsBaseButton['onClick'] = (event) => {
    event.preventDefault();
    setSearchParams();
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
    <BaseForm ref={refForm} className="flex flex-wrap gap-4" onSubmit={onSubmit} validations={validations}>
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