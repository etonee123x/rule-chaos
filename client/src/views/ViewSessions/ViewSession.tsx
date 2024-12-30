import {
  MessagePlayerPlacingItem,
  MessagePlayerWantsToStartRound,
  MessageType,
  type HistoryRecord,
  type Item,
  type ItemWithPosition,
  type SessionState,
} from '@/helpers/message';
import { BasePage } from '@/components/BasePage';
import { useWebSocket } from '@/contexts/webSocket';
import { doesMessageHasType } from '@/helpers/message';
import { useCallback, useEffect, useMemo, useRef, useState, type FC } from 'react';
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
import { TheOutOfRoundPanel } from './components/TheOutOfRoundPanel';

export const ViewSession: FC = () => {
  const { id } = useParams();
  const { addEventListener, open, close, send } = useWebSocket();
  const navigate = useNavigate();

  const { SESSIONS } = ROUTER_ID_TO_PATH_BUILDER;

  const [players, setPlayers] = useState<Array<Player>>([]);
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [itemsInHand, setItemsInHand] = useState<Array<Item>>([]);
  const [itemsOnField, setItemsOnField] = useState<Array<ItemWithPosition>>([]);
  const [history, setHistory] = useState<Array<HistoryRecord>>([]);
  const [isRoundActive, setIsRoundActive] = useState(false);

  const refHistory = useRef<HTMLDivElement>(null);

  const session: SessionState = useMemo(
    () => ({
      player,
      players,
      itemsInHand,
      itemsOnField,
      history,
      activePlayer,
      isRoundActive,
    }),
    [player, players, itemsInHand, history, activePlayer, itemsOnField, isRoundActive],
  );

  useEffect(() => {
    if (!refHistory.current) {
      return;
    }

    refHistory.current.scrollTop = refHistory.current.scrollHeight;
  }, [history]);

  useEffect(() => {
    if (isNil(id)) {
      return close;
    }

    open(id);

    return close;
  }, [id, open, close]);

  useEffect(() => addEventListener('close', () => navigate(SESSIONS())));

  useEffect(() => {}, [history]);

  useEffect(() =>
    addEventListener('message', (message) => {
      if (doesMessageHasType(message, MessageType.SessionInitialization)) {
        setPlayer(message.player);
        setPlayers(message.sessionState.players);
        setHistory(message.sessionState.history);
        setActivePlayer(message.sessionState.activePlayer);
        setItemsInHand(message.sessionState.itemsInHand);
        setItemsOnField(message.sessionState.itemsOnField);
        setIsRoundActive(message.sessionState.isRoundActive);

        return;
      }

      if (doesMessageHasType(message, MessageType.PlayerJoinedSession)) {
        setPlayers(message.players);

        return;
      }

      if (doesMessageHasType(message, MessageType.ItemsInHandUpdate)) {
        setItemsInHand(message.itemsInHand);

        return;
      }

      if (doesMessageHasType(message, MessageType.ItemsOnFieldUpdate)) {
        setItemsOnField(message.itemsOnField);

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

  const onDrop = useCallback(
    (itemWithPosition: ItemWithPosition) => {
      send(new MessagePlayerPlacingItem(itemWithPosition));
    },
    [send],
  );

  const onClickButtonStartRound = useCallback(() => {
    send(new MessagePlayerWantsToStartRound());
  }, [send]);

  return (
    <BasePage className="flex flex-col h-[calc(100vh-65px)]">
      <DndProvider backend={HTML5Backend}>
        <SessionProvider session={session}>
          <div className="flex mb-5 gap-8 h-5/6">
            <div className="aspect-square">
              {isRoundActive ? ( //
                <TheField onDrop={onDrop} />
              ) : (
                <TheOutOfRoundPanel onClickButtonStartRound={onClickButtonStartRound} />
              )}
            </div>
            <ThePlayersList className="w-1/6 overflow-y-auto" />
            <TheHistoryFeed ref={refHistory} className="flex-1 overflow-y-auto" />
          </div>
          <TheHand className="mt-auto h-1/6" />
        </SessionProvider>
      </DndProvider>
    </BasePage>
  );
};
