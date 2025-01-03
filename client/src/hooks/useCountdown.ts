import type { FunctionCallback } from '@/types';
import { clamp } from '@/utils/clamp';
import { isNil } from '@/utils/isNil';
import { useInterval } from '@reactuses/core';
import { useMemo, useState } from 'react';

export const useCountdown = () => {
  const [timeEnd, setTimeEnd] = useState<number | null>(null);
  const [timeStart, setTimeStart] = useState<number | null>(null);
  const [timeNow, setTimeNow] = useState<number>(Date.now);

  const [callback, setCallback] = useState<FunctionCallback | null>(null);

  const timeRemain = useMemo(() => (isNil(timeEnd) ? null : timeEnd - timeNow), [timeEnd, timeNow]);

  const partPassed = useMemo(
    () =>
      isNil(timeEnd) || isNil(timeStart) //
        ? null
        : clamp((timeNow - timeStart) / (timeEnd - timeStart)),
    [timeStart, timeEnd, timeNow],
  );

  const startTo = (time: number, _callback: FunctionCallback | null = null) => {
    setTimeStart(timeNow);
    setTimeEnd(time);
    setCallback(_callback);
  };

  const startBy = (time: number, _callback: FunctionCallback | null = null) => {
    setTimeStart(timeNow);
    setTimeEnd(timeNow + time);
    setCallback(_callback);
  };

  useInterval(() => {
    setTimeNow(Date.now);

    if (isNil(timeEnd) || timeNow < timeEnd) {
      return;
    }

    setTimeEnd(null);
    setTimeStart(null);
    callback?.();
  }, 1000);

  return {
    startTo,
    startBy,

    timeRemain,

    partPassed,
  };
};
