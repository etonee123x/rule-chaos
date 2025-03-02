import type { Nil } from '../types';

export const isNil = <T>(argument: T | Nil): argument is Nil => argument == null;
