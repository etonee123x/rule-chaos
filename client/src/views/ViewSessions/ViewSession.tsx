import { MessageType, type Item, type Player } from '@/api/messages';
import { BasePage } from '@/components/BasePage';
import { useWebSocket } from '@/contexts/webSocket';
import { doesMessageHasType } from '@/helpers/doesMessageHasType';
import { useEffect, useState, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Players } from './components/Players';
import { isNil } from '@/utils/isNil';
import { TheHand } from './components/TheHand';
import { TheField } from './components/TheField';
import { TheHistoryFeed } from './components/TheHistoryFeed';
import { ROUTER_ID_TO_PATH_BUILDER } from '@/router';

export const ViewSession: FC = () => {
  const { id } = useParams();
  const { addEventListener, open, close } = useWebSocket();
  const navigate = useNavigate();

  const { SESSIONS } = ROUTER_ID_TO_PATH_BUILDER;

  const [players, setPlayers] = useState<Array<Player>>([]);
  const [activePlayer, setActivePlayer] = useState<Player>();
  const [player, setPlayer] = useState<Player>();
  const [items, setItems] = useState<Array<Item>>([]);

  useEffect(() => {
    if (isNil(id)) {
      return close;
    }

    open(id);

    return close;
  }, [id, open, close]);

  useEffect(() => addEventListener('close', () => navigate(SESSIONS())));

  useEffect(() =>
    addEventListener('message', (message) => {
      if (doesMessageHasType(message, MessageType.PlayerJoinedSession)) {
        setPlayers(message.players);

        return;
      }

      if (doesMessageHasType(message, MessageType.ItemsUpdate)) {
        setItems(message.itemsCurrent);

        return;
      }

      if (doesMessageHasType(message, MessageType.PlayerLeftSession)) {
        setPlayers(message.players);

        return;
      }

      if (doesMessageHasType(message, MessageType.RoundWasStarted)) {
        return;
      }

      if (doesMessageHasType(message, MessageType.NewActivePlayer)) {
        setActivePlayer(message.player);

        return;
      }

      if (doesMessageHasType(message, MessageType.PlayerSelfIdentification)) {
        setPlayer(message.player);

        return;
      }

      console.warn(message);
    }),
  );

  return (
    <BasePage className="flex-1 flex flex-col">
      <div className="flex mb-5 gap-8">
        <div className="flex-1 flex gap-8">
          <TheField />
          <TheHistoryFeed className="flex-1" />
        </div>
        {players.length > 0 && (
          <Players className="w-1/6" players={players} player={player} activePlayer={activePlayer} />
        )}
      </div>
      {items.length > 0 && <TheHand className="mt-auto" items={items} />}
    </BasePage>
  );
};
