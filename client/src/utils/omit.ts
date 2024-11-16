export const omit = <TObject extends object, Key extends keyof TObject>(
  object: TObject,
  keys: Array<Key>,
): Omit<TObject, Key> => {
  const _keys = keys.map(String);

  return Object.fromEntries(Object.entries(object).filter(([key]) => !_keys.includes(key))) as Omit<TObject, Key>;
};

export const omitCurried =
  <TObject extends object, Key extends keyof TObject>(keys: Array<Key>) =>
  (object: TObject) =>
    omit(object, keys);
