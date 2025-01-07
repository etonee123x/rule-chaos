import { useCallback, useEffect, type FC } from 'react';
import { BasePage } from '@/components/BasePage';
import { FormCreateSession, type Props as PropsFormCreateSession } from './components/FormCreateSession';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAll, type Session } from '@/api/sessions';
import { ROUTER_ID_TO_PATH_BUILDER } from '@/router';
import { Link, useNavigate } from 'react-router-dom';
import { useTimeoutFn } from '@reactuses/core';
import { BaseButton } from '@/components/ui/BaseButton';
import { mdiChevronRight, mdiRefresh, mdiAccountMultiple, mdiTimerOutline } from '@mdi/js';
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

  const sessionToMeta = useCallback(
    (session: Session) => [
      { id: 0, path: mdiAccountMultiple, value: session.players.length, title: 'Кол-во игроков' },
      ...(session.turnDuration
        ? [
            {
              id: 1,
              path: mdiTimerOutline,
              value: session.turnDuration,
              title: 'Продолжительность хода',
            },
          ]
        : []),
    ],
    [],
  );

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
              <li className="mb-2 last:mb-0 rounded bg-gray-100 text hover:bg-gray-200" key={session.id}>
                <Link className="flex items-center p-4" to={SESSION(session.id)}>
                  <div className="flex gap-4">
                    {sessionToMeta(session).map((sessionMeta) => (
                      <div className="flex flex-col gap-1 items-center" key={sessionMeta.id} title={sessionMeta.title}>
                        <BaseIcon path={sessionMeta.path} />
                        {sessionMeta.value}
                      </div>
                    ))}
                  </div>
                  <BaseIcon className="ms-auto text-2xl" path={mdiChevronRight} />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </BasePage>
  );
};
