import {
  MessagePlayerPlacingItem,
  MessagePlayerVotes,
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
import { VotingValue, type Voting as IVoting } from '@/helpers/voting';
import { Voting } from '@/components/Voting';

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
  const [activeVoting, setActiveVoting] = useState<IVoting | null>(null);

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
      activeVoting,
    }),
    [player, players, itemsInHand, history, activePlayer, itemsOnField, isRoundActive, activeVoting],
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

  useEffect(() =>
    addEventListener('message', (message) => {
      if (doesMessageHasType(message, MessageType.SessionInitiation)) {
        setPlayer(message.player);
        setPlayers(message.sessionState.players);
        setHistory(message.sessionState.history);
        setActivePlayer(message.sessionState.activePlayer);
        setItemsInHand(message.sessionState.itemsInHand);
        setItemsOnField(message.sessionState.itemsOnField);
        setIsRoundActive(message.sessionState.isRoundActive);
        setActiveVoting(message.sessionState.activeVoting);

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

      if (doesMessageHasType(message, MessageType.HistoryUpdate)) {
        setHistory(message.history);

        return;
      }

      if (
        doesMessageHasType(message, MessageType.VotingInitiation) ||
        doesMessageHasType(message, MessageType.VotingUpdate)
      ) {
        setActiveVoting(message.activeVoting);

        return;
      }

      if (doesMessageHasType(message, MessageType.VotingEnd)) {
        setActiveVoting(null);

        return;
      }

      console.warn(message);
    }),
  );

  const onDrop = useCallback(
    (itemWithPosition: ItemWithPosition) => send(new MessagePlayerPlacingItem(itemWithPosition)),
    [send],
  );

  const onClickButtonStartRound = useCallback(() => send(new MessagePlayerWantsToStartRound()), [send]);

  const onVotePositive = useCallback(() => send(new MessagePlayerVotes(VotingValue.Positive)), [send]);
  const onVoteNegative = useCallback(() => send(new MessagePlayerVotes(VotingValue.Negative)), [send]);

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
          <Voting onVotePositive={onVotePositive} onVoteNegative={onVoteNegative} />
        </SessionProvider>
      </DndProvider>
    </BasePage>
  );
};
