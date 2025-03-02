import type { Nil } from '@rule-chaos/types';
import { isNil } from '@/utils/isNil';

export const isNotNil = <T>(argument: T | Nil): argument is T => !isNil(argument);
