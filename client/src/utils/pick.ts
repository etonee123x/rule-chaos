export const pick = <TObject extends object, Key extends keyof TObject>(
  object: TObject,
  keys: Array<Key>,
): Pick<TObject, Key> => {
  const _keys = keys.map(String);

  return Object.fromEntries(Object.entries(object).filter(([key]) => _keys.includes(key))) as Pick<TObject, Key>;
};

export const pickCurried =
  <TObject extends object, Key extends keyof TObject>(keys: Array<Key>) =>
  (object: TObject) =>
    pick(object, keys);
