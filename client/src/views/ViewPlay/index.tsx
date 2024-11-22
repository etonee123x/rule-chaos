import { MessageType, type Player } from '@/api/messages';
import { addHandler } from '@/api/websocket';
import { doesMessageHasType } from '@/helpers/doesMessageHasType';
import { useEffect, useState, type FC } from 'react';

import { Players } from './components/Players';

export const ViewPlay: FC = () => {
  const [playersNames, setPlayersNames] = useState<Array<Player['name']>>([]);

  useEffect(() =>
    addHandler((message) => {
      if (doesMessageHasType(message, MessageType.PlayerJoinedSession)) {
        setPlayersNames(message.PlayersNames);

        return;
      }

      if (doesMessageHasType(message, MessageType.PlayerLeftSession)) {
        setPlayersNames(message.PlayersNames);

        return;
      }

      if (doesMessageHasType(message, MessageType.SessionWasStarted)) {
        return;
      }

      if (doesMessageHasType(message, MessageType.NewActivePlayer)) {
        return;
      }
    }),
  );

  return (
    <>
      Игра!
      {playersNames.length && <Players playersNames={playersNames} />}
    </>
  );
};
