import { MessageType, type HistoryRecord, type Item } from '@/helpers/message';
import { BasePage } from '@/components/BasePage';
import { useWebSocket } from '@/contexts/webSocket';
import { doesMessageHasType } from '@/helpers/message';
import { useEffect, useState, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Players } from './components/Players';
import { isNil } from '@/utils/isNil';
import { TheHand } from './components/TheHand';
import { TheField } from './components/TheField';
import { TheHistoryFeed } from './components/TheHistoryFeed';
import { ROUTER_ID_TO_PATH_BUILDER } from '@/router';
import type { Player } from '@/helpers/player';

export const ViewSession: FC = () => {
  const { id } = useParams();
  const { addEventListener, open, close } = useWebSocket();
  const navigate = useNavigate();

  const { SESSIONS } = ROUTER_ID_TO_PATH_BUILDER;

  const [players, setPlayers] = useState<Array<Player>>([]);
  const [activePlayer, setActivePlayer] = useState<Player>();
  const [player, setPlayer] = useState<Player>();
  const [items, setItems] = useState<Array<Item>>([]);
  const [history, setHistory] = useState<Array<HistoryRecord>>([]);

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

      if (doesMessageHasType(message, MessageType.History)) {
        setHistory(message.history);

        return;
      }

      console.warn(message);
    }),
  );

  return (
    <BasePage className="flex flex-col h-[calc(100vh-65px)]">
      <div className="flex mb-5 gap-8 h-5/6">
        <TheField />
        <TheHistoryFeed className="flex-1 overflow-y-auto" history={history} />
        <Players className="w-1/6 overflow-y-auto" players={players} player={player} activePlayer={activePlayer} />
      </div>
      <TheHand className="mt-auto h-1/6" items={items} />
    </BasePage>
  );
};
