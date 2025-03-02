import type { Nil } from '@rule-chaos/types';

export const isNil = <T>(argument: T | Nil): argument is Nil => argument == null;
