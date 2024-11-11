import { open, close } from '@/api/websocket';
import { BaseButton } from '@/components/ui/BaseButton';
import { BaseInputText } from '@/components/ui/BaseInputText';
import { ROUTER_ID_TO_PATH_BUILDER } from '@/router';
import { useState, type FormEventHandler } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

export const ViewPlayForm = () => {
  const [sessionCode, setSessionCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const model = {
    sessionCode,
    playerName,
  };

  const { sessionCode: paramsSessionCode } = useParams();

  const { PLAY_WITH_SESSION_CODE, PLAY } = ROUTER_ID_TO_PATH_BUILDER;

  const navigate = useNavigate();

  const onChangeSessionCode = setSessionCode;
  const onChangePlayerName = setPlayerName;

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    open(model.sessionCode, model.playerName).then(() => navigate(PLAY_WITH_SESSION_CODE(sessionCode)));
  };

  const onClickExit = () => {
    close();
    setSessionCode('');
    setPlayerName('');
    navigate(PLAY());
  };

  return (
    <>
      <div>
        <form className="flex gap-4 py-2" onSubmit={onSubmit}>
          <BaseInputText label="Код сессии" value={model.sessionCode} onChange={onChangeSessionCode} />
          <BaseInputText label="Имя" value={model.playerName} onChange={onChangePlayerName} />
          <BaseButton>Подключиться</BaseButton>
        </form>
        {paramsSessionCode && <BaseButton onClick={onClickExit}>Выйти</BaseButton>}
      </div>
      <Outlet />
    </>
  );
};
