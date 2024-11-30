import { useState, useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAsyncData = <Data, Args extends Array<any>>(callback: (...args: Args) => Promise<Data>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<unknown>(null);

  const execute = useCallback(
    (...args: Args): Promise<Data> => {
      setIsLoading(true);
      setError(null);

      return callback(...args)
        .then((data) => {
          setData(data);

          return data;
        })
        .catch((error) => {
          setError(error);

          throw error;
        })
        .finally(() => setIsLoading(false));
    },
    [callback],
  );

  return { isLoading, execute, data, error };
};
