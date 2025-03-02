import { useGameSession } from '@/contexts/gameSession';
import { useCountdown } from '@/hooks/useCountdown';
import { useEffect } from 'react';

export const useActiveVotingCountDown = () => {
  const { activeVoting } = useGameSession();
  const { startTo, stop, timeRemain, timeEnd, partPassed } = useCountdown();

  useEffect(() => {
    if (!activeVoting) {
      return stop();
    }

    if (activeVoting.timerLimits.endAt === timeEnd) {
      return;
    }

    startTo(activeVoting.timerLimits.endAt, { timeStart: activeVoting.timerLimits.startAt });
  }, [activeVoting, timeEnd, stop, startTo]);

  return {
    timeRemain,
    partPassed,
  };
};
