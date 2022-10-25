// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdValueTypeMetadata {
  constructor(): void;
  getName(): string;
  setName(name_: string): gdValueTypeMetadata;
  getExtraInfo(): string;
  setExtraInfo(extraInfo_: string): gdValueTypeMetadata;
  isOptional(): boolean;
  setOptional(optional_: boolean): gdValueTypeMetadata;
  getDefaultValue(): string;
  setDefaultValue(defaultValue_: string): gdValueTypeMetadata;
  isObject(): boolean;
  isBehavior(): boolean;
  isNumber(): boolean;
  isString(): boolean;
  isVariable(): boolean;
  static typeIsObject(param: string): boolean;
  static typeIsBehavior(param: string): boolean;
  static typeIsExpression(type_: string, parameterType: string): boolean;
  serializeTo(element: gdSerializerElement): void;
  unserializeFrom(element: gdSerializerElement): void;
  delete(): void;
  ptr: number;
};