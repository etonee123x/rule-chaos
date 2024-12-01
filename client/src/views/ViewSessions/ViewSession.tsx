import { MessageType, type Player } from '@/api/messages';
import { BasePage } from '@/components/BasePage';
import { BaseButton } from '@/components/ui/BaseButton';
import { useWebSocket } from '@/contexts/webSocket';
import { doesMessageHasType } from '@/helpers/doesMessageHasType';
import { arePlayersEqual } from '@/helpers/player';
import { useEffect, useState, type FC } from 'react';
import { useParams } from 'react-router-dom';
import { Players } from './components/Players';
import { isNil } from '@/utils/isNil';

export const ViewSession: FC = () => {
  const { id } = useParams();
  const { addHandler, send, open, close } = useWebSocket();

  const [players, setPlayers] = useState<Array<Player>>([]);
  const [activePlayer, setActivePlayer] = useState<Player>();
  const [player, setPlayer] = useState<Player>();

  const isAbleToTurn = Boolean(player && activePlayer && arePlayersEqual(player, activePlayer));

  useEffect(() => {
    if (isNil(id)) {
      return;
    }

    open(id);
  }, [id, open, close]);

  useEffect(() => close, [close]);

  useEffect(() =>
    addHandler((message) => {
      console.log(message);
      if (doesMessageHasType(message, MessageType.PlayerJoinedSession)) {
        setPlayers(message.players);

        return;
      }

      if (doesMessageHasType(message, MessageType.PlayerLeftSession)) {
        setPlayers(message.players);

        return;
      }

      if (doesMessageHasType(message, MessageType.SessionWasStarted)) {
        return;
      }

      if (doesMessageHasType(message, MessageType.NewActivePlayer)) {
        setActivePlayer(message.player);

        return;
      }

      if (doesMessageHasType(message, MessageType.PlayerSelfIdentification)) {
        setPlayer(message.player);
      }
    }),
  );

  const onClickButton = () => send(MessageType.TEST_PlayerClickedButton, {});

  return (
    <BasePage className="flex">
      <div className="flex-1">
        <div>Игра!</div>
        {isAbleToTurn && <div>Твой ход!</div>}
        <BaseButton disabled={!isAbleToTurn} onClick={onClickButton}>
          тык
        </BaseButton>
      </div>
      {players.length > 0 && (
        <Players className="w-1/6" players={players} player={player} activePlayer={activePlayer} />
      )}
    </BasePage>
  );
};
