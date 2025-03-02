export type FunctionCallback = () => void | Promise<void>;

export type Nil = null | undefined;

export interface WithId {
  id: string;
}
