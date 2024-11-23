import { MessageType, type Player } from '@/api/messages';
import { addHandler } from '@/api/websocket';
import { doesMessageHasType } from '@/helpers/doesMessageHasType';
import { useEffect, useState, type FC } from 'react';

import { Players } from './components/Players';
import { arePlayersEqual } from '@/helpers/player';
import { BasePage } from '@/components/BasePage';

export const ViewPlay: FC = () => {
  const [players, setPlayers] = useState<Array<Player>>([]);
  const [activePlayer, setActivePlayer] = useState<Player>();
  const [player, setPlayer] = useState<Player>();

  const isAbleToTurn = Boolean(player && activePlayer && arePlayersEqual(player, activePlayer));

  useEffect(() =>
    addHandler((message) => {
      if (doesMessageHasType(message, MessageType.PlayerJoinedSession)) {
        setPlayers(message.Players);

        return;
      }

      if (doesMessageHasType(message, MessageType.PlayerLeftSession)) {
        setPlayers(message.Players);

        return;
      }

      if (doesMessageHasType(message, MessageType.SessionWasStarted)) {
        return;
      }

      if (doesMessageHasType(message, MessageType.NewActivePlayer)) {
        setActivePlayer(message.Player);

        return;
      }

      if (doesMessageHasType(message, MessageType.PlayerSelfIdentification)) {
        setPlayer(message.Player);
      }
    }),
  );

  return (
    <BasePage>
      <div className="flex">
        <div className="flex-1">
          Игра!
          {isAbleToTurn && <div>Твой ход!</div>}
        </div>
        {players.length > 0 && (
          <Players className="w-1/6" players={players} player={player} activePlayer={activePlayer} />
        )}
      </div>
    </BasePage>
  );
};
