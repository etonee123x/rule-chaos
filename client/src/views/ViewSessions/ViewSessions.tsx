import { useCallback, useEffect, type FC } from 'react';

import { BasePage } from '@/components/BasePage';
import { FormCreateSession, type Props as PropsFormCreateSession } from './components/FormCreateSession';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAll } from '@/api/sessions';
import { ROUTER_ID_TO_PATH_BUILDER } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useTimeoutFn } from '@reactuses/core';
import { BaseButton } from '@/components/ui/BaseButton';
import { mdiRefresh } from '@mdi/js';

export const ViewSessions: FC = () => {
  const { SESSION } = ROUTER_ID_TO_PATH_BUILDER;
  const { data: sessions, execute: getAllSessions } = useAsyncData(getAll);

  const navigate = useNavigate();

  const [, start, cancel] = useTimeoutFn(() => getAllSessions().finally(start), 60_000);

  useEffect(() => {
    getAllSessions().finally(start);
  }, [getAllSessions, start]);

  const onPost: NonNullable<PropsFormCreateSession['onPost']> = useCallback(
    (session) => {
      getAllSessions();
      navigate(SESSION(session.id));
    },
    [getAllSessions, SESSION, navigate],
  );

  const onClickRefresh = useCallback(() => {
    cancel();
    getAllSessions().finally(start);
  }, [cancel, getAllSessions, start]);

  return (
    <BasePage className="flex flex-col">
      <FormCreateSession className="mb-4" onPost={onPost} />
      <div>
        <BaseButton propsIconPrepend={{ path: mdiRefresh }} onClick={onClickRefresh}></BaseButton>
        {!sessions?.length ? (
          <div>Нет сессий, будь первым сука</div>
        ) : (
          <ul>
            {sessions.map((session) => (
              <li key={session.id}>{JSON.stringify(session)}</li>
            ))}
          </ul>
        )}
      </div>
    </BasePage>
  );
};
