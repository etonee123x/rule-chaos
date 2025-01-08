import {
  MessagePlayerPlacingItem,
  MessagePlayerVotes,
  MessagePlayerWantsToStartRound,
  MessageType,
  type HistoryRecord,
  type Item,
  type ItemWithPosition,
  type GameSession,
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
import { arePlayersEqual, type Player } from '@/helpers/player';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { GameSessionProvider } from '@/contexts/gameSession';
import { TheOutOfRoundPanel } from './components/TheOutOfRoundPanel';
import { VotingValue, type Voting as IVoting } from '@/helpers/voting';
import { Voting } from '@/components/Voting';
import type { TimerLimits } from '@/helpers/timerLimits';
import { useNotifications } from '@/contexts/notifications';
import { pick } from '@/utils/pick';
import { ThePlayerProvider } from '@/contexts/thePlayer';

export const ViewSession: FC = () => {
  const { id } = useParams();
  const { addEventListener, open, close, send } = useWebSocket();
  const navigate = useNavigate();

  const { SESSIONS } = ROUTER_ID_TO_PATH_BUILDER;

  const [turnTimerLimits, setTurnTimerLimits] = useState<TimerLimits | null>(null);
  const [players, setPlayers] = useState<Array<Player>>([]);
  const [thePlayer, setThePlayer] = useState<Player | null>(null);
  const [itemsInHand, setItemsInHand] = useState<Array<Item>>([]);
  const [itemsOnField, setItemsOnField] = useState<Array<ItemWithPosition>>([]);
  const [history, setHistory] = useState<Array<HistoryRecord>>([]);
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [activeVoting, setActiveVoting] = useState<IVoting | null>(null);

  const refHistory = useRef<HTMLDivElement>(null);

  const { notify } = useNotifications();

  const gameSession = useMemo<GameSession>(
    () => ({
      players,
      itemsInHand,
      itemsOnField,
      history,
      isRoundActive,
      activeVoting,
      turnTimerLimits,
    }),
    [players, itemsInHand, history, itemsOnField, isRoundActive, activeVoting, turnTimerLimits],
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
      if (doesMessageHasType(message, MessageType.PlayerInitiation)) {
        setThePlayer(message.thePlayer);

        return;
      }

      if (doesMessageHasType(message, MessageType.SessionInitiation)) {
        setPlayers(message.gameSession.players);
        setHistory(message.gameSession.history);
        setItemsInHand(message.gameSession.itemsInHand);
        setItemsOnField(message.gameSession.itemsOnField);
        setIsRoundActive(message.gameSession.isRoundActive);
        setActiveVoting(message.gameSession.activeVoting);
        setTurnTimerLimits(message.gameSession.turnTimerLimits);

        return;
      }

      if (doesMessageHasType(message, MessageType.PlayersUpdate)) {
        setPlayers(message.players);
        const maybeThePlayer = thePlayer && message.players.find((player) => arePlayersEqual(player, thePlayer));

        if (maybeThePlayer) {
          setThePlayer(maybeThePlayer);
        }

        setTurnTimerLimits(message.turnTimerLimits);

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

      if (doesMessageHasType(message, MessageType.RoundWasStarted)) {
        setPlayers(message.players);
        setIsRoundActive(true);

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

      if (doesMessageHasType(message, MessageType.Notification)) {
        notify({
          type: message.notificationType,
          ...pick(message, ['title', 'description']),
        });

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

  const onClickVotePositive = useCallback(() => send(new MessagePlayerVotes(VotingValue.Positive)), [send]);
  const onClickVoteNegative = useCallback(() => send(new MessagePlayerVotes(VotingValue.Negative)), [send]);

  return (
    <BasePage className="flex flex-col h-[calc(100vh-65px)]">
      <DndProvider backend={HTML5Backend}>
        <GameSessionProvider gameSession={gameSession}>
          {!thePlayer ? (
            <div>Инициализация игрока...</div>
          ) : (
            <ThePlayerProvider thePlayer={thePlayer}>
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
              {isRoundActive && <TheHand className="mt-auto h-1/6" />}
              <Voting {...{ onClickVotePositive, onClickVoteNegative }} />
            </ThePlayerProvider>
          )}
        </GameSessionProvider>
      </DndProvider>
    </BasePage>
  );
};
