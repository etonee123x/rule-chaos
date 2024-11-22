import { MessageType } from '@/api/messages';
import { addHandler } from '@/api/websocket';
import { doesMessageHasType } from '@/helpers/doesMessageHasType';
import { useEffect, type FC } from 'react';

export const ViewPlay: FC = () => {
  useEffect(
    () =>
      addHandler((message) => {
        if (doesMessageHasType(message, MessageType.PlayerJoinedSession)) {
          return console.log('Оппа, присоединился');
        }

        if (doesMessageHasType(message, MessageType.PlayerLeftSession)) {
          return console.log('Оппа, отсоединился');
        }

        if (doesMessageHasType(message, MessageType.SessionWasStarted)) {
          return console.log('Оппа, сессия началась');
        }

        if (doesMessageHasType(message, MessageType.NewActivePlayer)) {
          return console.log('Оппа, новый ход');
        }
      }),

    addHandler(MessageType.PlayerJoinedSession, (message) => {}),
  );

  return <>Игра!</>;
};
