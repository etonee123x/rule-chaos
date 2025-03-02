export const invoke =
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  <T extends (...args: Array<any>) => any>(...parameters: Parameters<T>) =>
    (_function: T): ReturnType<T> =>
      _function(...parameters);
