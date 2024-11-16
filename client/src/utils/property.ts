export const property = <TObject extends object, TProperty extends keyof TObject>(
  object: TObject,
  _property: TProperty,
): TObject[TProperty] => object[_property];

export const propertyCurried =
  <TObject extends object, TProperty extends keyof TObject>(_property: TProperty) =>
  (object: TObject) =>
    property(object, _property);
