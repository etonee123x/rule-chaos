import { useCallback, useEffect, type FC } from 'react';

import { BasePage } from '@/components/BasePage';
import { FormCreateSession, type Props as PropsFormCreateSession } from './components/FormCreateSession';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAll } from '@/api/sessions';
import { ROUTER_ID_TO_PATH_BUILDER } from '@/router';
import { useNavigate } from 'react-router-dom';

export const ViewSessions: FC = () => {
  const { SESSION } = ROUTER_ID_TO_PATH_BUILDER;
  const { data: sessions, execute: getAllSessions } = useAsyncData(getAll);

  const navigate = useNavigate();

  useEffect(() => {
    getAllSessions();
  }, [getAllSessions]);

  const onPost: NonNullable<PropsFormCreateSession['onPost']> = useCallback(
    (session) => {
      getAllSessions();
      navigate(SESSION(session.id));
    },
    [getAllSessions, SESSION, navigate],
  );

  return (
    <BasePage className="flex">
      <FormCreateSession className="mb-4" onPost={onPost} />
      {!sessions?.length ? ( //
        <div>Нет сессий, будь первым сука</div>
      ) : (
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>{JSON.stringify(session)}</li>
          ))}
        </ul>
      )}
    </BasePage>
  );
};
