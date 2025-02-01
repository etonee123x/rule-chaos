/* eslint-disable @typescript-eslint/no-explicit-any */

export const invoke =
  <T extends (...args: Array<any>) => any>(...parameters: Parameters<T>) =>
    (_function: T): ReturnType<T> =>
      _function(...parameters);
