export enum VotingValue {
  Positive = 'Positive',
  Negative = 'Negative',
}

interface VotingBase {
  title: string;
  votesNumberPositive: number;
  votesNumberNegative: number;
  startedAt: number;
  endAt: number;
}

export interface VotingActive extends VotingBase {
  result: null;
}

export interface VotingEnded extends VotingBase {
  result: VotingValue;
}

export type Voting = VotingActive | VotingEnded;
