import type { FunctionCallback } from '@/types';
import { clamp } from '@/utils/clamp';
import { isNil } from '@/utils/isNil';
import { useInterval } from '@reactuses/core';
import { useCallback, useMemo, useState } from 'react';

interface StartOptions {
  callback?: FunctionCallback;
  timeStart?: number;
}

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

  const startBase = useCallback(
    (options: StartOptions = {}) => {
      setTimeStart(options.timeStart ?? timeNow);
      setCallback(options.callback ?? null);
    },
    [timeNow],
  );

  const startTo = useCallback(
    (time: number, options: StartOptions = {}) => {
      startBase(options);
      setTimeEnd(time);
    },
    [startBase],
  );

  const startBy = useCallback(
    (time: number, options: StartOptions = {}) => {
      startBase(options);
      setTimeEnd(timeNow + time);
    },
    [timeNow, startBase],
  );

  const stop = useCallback(() => {
    setTimeEnd(null);
    setTimeStart(null);
  }, []);

  useInterval(() => {
    setTimeNow(Date.now);

    if (isNil(timeEnd) || timeNow < timeEnd) {
      return;
    }

    callback?.();
  }, 100);

  return {
    startTo,
    startBy,

    stop,

    timeEnd,
    timeRemain,

    partPassed,
  };
};
