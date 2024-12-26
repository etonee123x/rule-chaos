import { useSession } from '@/contexts/sessionContext';
import { arePlayersEqual } from '@/helpers/player';
import { useMemo } from 'react';

export const useIsActivePlayer = () => {
  const { player, activePlayer } = useSession();

  const isActivePlayer = useMemo(
    () => Boolean(player && activePlayer && arePlayersEqual(player, activePlayer)),
    [player, activePlayer],
  );

  return isActivePlayer;
};
