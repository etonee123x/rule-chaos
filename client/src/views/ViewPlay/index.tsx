import { useCallback, useEffect, type FC } from 'react';

import { BasePage } from '@/components/BasePage';
import { FormCreateSession } from './components/FormCreateSession';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAll } from '@/api/sessions';

export const ViewPlay: FC = () => {
  const { data: sessions, execute: getAllSessions } = useAsyncData(getAll);

  useEffect(() => {
    getAllSessions();
  }, [getAllSessions]);

  const onPost = useCallback(() => getAllSessions(), [getAllSessions]);

  return (
    <BasePage className="flex">
      <FormCreateSession onPost={onPost} />
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
