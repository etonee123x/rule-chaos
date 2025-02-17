import type { TimerLimits } from '@/helpers/timerLimits';

export enum VotingValue {
  Positive = 'Positive',
  Negative = 'Negative',
}

export const VOTING_VALUE_TO_TEXT = Object.freeze({
  [VotingValue.Positive]: 'За',
  [VotingValue.Negative]: 'Против',
});

interface VotingBase {
  title: string;
  playersVotedPositiveIds: Array<string>;
  playersVotedNegativeIds: Array<string>;
  timerLimits: TimerLimits;
}

export interface VotingActive extends VotingBase {
  result: null;
}

export interface VotingEnded extends VotingBase {
  result: VotingValue;
}

export type Voting = VotingActive | VotingEnded;
