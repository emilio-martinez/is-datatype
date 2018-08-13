/**
 * The available data types that `is` can validate for.
 */
export enum DataType {
  any = 1,
  undefined,
  null,
  boolean,
  number,
  integer,
  natural,
  string,
  function,
  object,
  array,
  symbol
}

/**
 * Internal enum, identical to the above.
 * This is useful for perf reasons because it will be compiled to numbers
 */
export const enum DATATYPE {
  any = DataType.any,
  undefined = DataType.undefined,
  null = DataType.null,
  boolean = DataType.boolean,
  number = DataType.number,
  integer = DataType.integer,
  natural = DataType.natural,
  string = DataType.string,
  function = DataType.function,
  object = DataType.object,
  array = DataType.array,
  symbol = DataType.symbol
}

/**
 * The kind of enum DataType is.
 */
export type DT = number;

/** Validates a single DataType */
export function validDataType(dt: DataType | undefined | null): dt is DataType {
  return typeof dt === 'number' && dt in DataType;
}

/** Validates multiple DataTypes */
export function validMultiDataType(dt: DataType | DataType[] | undefined | null) {
  return Array.isArray(dt) ? dt.every(validDataType) : validDataType(dt);
}
