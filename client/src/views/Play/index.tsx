import { connect } from '@/api/websocket';
import { ROUTER_ID_TO_PATH_BUILDER } from '@/router';
import { useCallback, useId, useState, type ChangeEventHandler, type FormEventHandler } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const Play = () => {
  const [sessionCode, setSessionCode] = useState('');
  const id = useId();

  const { PLAY } = ROUTER_ID_TO_PATH_BUILDER;

  const [searchParams] = useSearchParams();

  const hasSessionCode = searchParams.has('session_code');

  useCallback(() => console.log(hasSessionCode), [sessionCode]);

  const navigate = useNavigate();

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => setSessionCode(event.target.value);

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    connect(sessionCode).then(() => navigate(PLAY({ sessionCode })));
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <label htmlFor={id}>Код сессии:</label>
        <input type="text" value={sessionCode} onChange={onChange} />
        <div>{searchParams}</div>
        <div>{String(hasSessionCode)}</div>
      </form>
    </>
  );
};
