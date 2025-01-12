import { BaseProgressBar } from '@/components/ui/BaseProgressBar';
import { useGameSession } from '@/contexts/gameSession';
import { useCountdown } from '@/hooks/useCountdown';
import { isNil } from '@/utils/isNil';
import { useEffect } from 'react';

export const TurnTimerLimitProgressBar = () => {
  const { turnTimerLimits } = useGameSession();

  const { partPassed, startTo, stop } = useCountdown();

  useEffect(
    () => (isNil(turnTimerLimits) ? stop() : startTo(turnTimerLimits.endAt, { timeStart: turnTimerLimits.startAt })),
    [turnTimerLimits, stop, startTo],
  );

  return <BaseProgressBar className="h-1" value={partPassed} isProgressInverted />;
};
