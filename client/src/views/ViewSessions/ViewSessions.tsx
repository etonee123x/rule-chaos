import { useCallback, useEffect, type FC } from 'react';

import { BasePage } from '@/components/BasePage';
import { FormCreateSession, type Props as PropsFormCreateSession } from './components/FormCreateSession';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAll } from '@/api/sessions';
import { ROUTER_ID_TO_PATH_BUILDER } from '@/router';
import { Link, useNavigate } from 'react-router-dom';
import { useTimeoutFn } from '@reactuses/core';
import { BaseButton } from '@/components/ui/BaseButton';
import { mdiChevronRight, mdiRefresh } from '@mdi/js';
import { BaseIcon } from '@/components/ui/BaseIcon';

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
        <div className="flex items-center gap-2 mb-4 justify-end">
          <div>Найдено сессий: {sessions?.length ?? 0}</div>
          <BaseButton propsIconPrepend={{ path: mdiRefresh }} onClick={onClickRefresh}></BaseButton>
        </div>
        {!sessions?.length ? (
          <div>Нет сессий, будь первым сука</div>
        ) : (
          <ol>
            {sessions.map((session) => (
              <li className="mb-2 last:mb-0 rounded bg-slate-100" key={session.id}>
                <Link className="flex items-center p-4" to={SESSION(session.id)}>
                  <div>Игроков: {session.playersInSession.length}</div>
                  <BaseIcon className="ms-auto" path={mdiChevronRight}></BaseIcon>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </BasePage>
  );
};
