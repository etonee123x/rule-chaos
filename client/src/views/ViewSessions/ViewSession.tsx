import { MessageType, type HistoryRecord, type Item, type SessionState } from '@/helpers/message';
import { BasePage } from '@/components/BasePage';
import { useWebSocket } from '@/contexts/webSocket';
import { doesMessageHasType } from '@/helpers/message';
import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThePlayersList } from './components/ThePlayersList';
import { isNil } from '@/utils/isNil';
import { TheHand } from './components/TheHand';
import { TheField } from './components/TheField';
import { TheHistoryFeed } from './components/TheHistoryFeed';
import { ROUTER_ID_TO_PATH_BUILDER } from '@/router';
import type { Player } from '@/helpers/player';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { SessionProvider } from '@/contexts/sessionContext';

export const ViewSession: FC = () => {
  const { id } = useParams();
  const { addEventListener, open, close } = useWebSocket();
  const navigate = useNavigate();

  const { SESSIONS } = ROUTER_ID_TO_PATH_BUILDER;

  const [players, setPlayers] = useState<Array<Player>>([]);
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [itemsInHand, setItemsInHand] = useState<Array<Item>>([]);
  const [history, setHistory] = useState<Array<HistoryRecord>>([]);

  const session: SessionState = useMemo(
    () => ({
      player,
      players,
      itemsInHand,
      history,
      activePlayer,
    }),
    [player, players, itemsInHand, history, activePlayer],
  );

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
      if (doesMessageHasType(message, MessageType.SessionInitialization)) {
        setPlayer(message.player);
        setPlayers(message.sessionState.players);
        setHistory(message.sessionState.history);
        setActivePlayer(message.sessionState.activePlayer);
        setItemsInHand(message.sessionState.itemsInHand);

        return;
      }

      if (doesMessageHasType(message, MessageType.PlayerJoinedSession)) {
        setPlayers(message.players);

        return;
      }

      if (doesMessageHasType(message, MessageType.ItemsUpdate)) {
        setItemsInHand(message.itemsCurrent);

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

      if (doesMessageHasType(message, MessageType.History)) {
        setHistory(message.history);

        return;
      }

      console.warn(message);
    }),
  );

  const onDrop = useCallback((item: Item, [row, col]: [number, number]) => {
    console.log('сейчас из компонента вьюхи отправим:', item, { row, col });
  }, []);

  return (
    <BasePage className="flex flex-col h-[calc(100vh-65px)]">
      <DndProvider backend={HTML5Backend}>
        <SessionProvider session={session}>
          <div className="flex mb-5 gap-8 h-5/6">
            <TheField onDrop={onDrop} />
            <ThePlayersList className="w-1/6 overflow-y-auto" />
            <TheHistoryFeed className="flex-1 overflow-y-auto" />
          </div>
          <TheHand className="mt-auto h-1/6" />
        </SessionProvider>
      </DndProvider>
    </BasePage>
  );
};
