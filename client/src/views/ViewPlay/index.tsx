import { MessageType, type Player } from '@/api/messages';
import { doesMessageHasType } from '@/helpers/doesMessageHasType';
import { useEffect, useState, type FC } from 'react';

import { Players } from './components/Players';
import { arePlayersEqual } from '@/helpers/player';
import { BasePage } from '@/components/BasePage';
import { BaseButton } from '@/components/ui/BaseButton';
import { useWebSocket } from '@/contexts/webSocket';
import { BaseForm } from '@/components/ui/BaseForm';

export const ViewPlay: FC = () => {
  const { isOpened, addHandler, send } = useWebSocket();

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

  const onClickButton = () => send(MessageType.TEST_PlayerClickedButton, {});

  return (
    <BasePage className="flex">
      <BaseButton >Создать</BaseButton>
    </BasePage>
  );
};
