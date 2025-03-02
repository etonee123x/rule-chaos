import type { Nil } from '@/types';
import { isNil } from '@/utils/isNil';

export const isNotNil = <T>(argument: T | Nil): argument is T => !isNil(argument);
