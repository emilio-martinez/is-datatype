/**
 * The available data types that `is` can validate for.
 */
export enum DataType {
  any = -1,
  // Primitives
  undefined = 1,
  null,
  boolean,
  number,
  integer,
  natural,
  string,
  // Non-primitives
  function = 11,
  object,
  array
}

/**
 * Internal enum, identical to the above.
 * This is useful for perf reasons because it will be compiled to numbers
 */
export const enum DATATYPE {
  any = -1,
  // Primitives
  undefined = 1,
  null,
  boolean,
  number,
  integer,
  natural,
  string,
  // Non-primitives
  function = 11,
  object,
  array
}

/**
 * Merged type to help TS understand these enums have the same values
 * although one is a regular `enum` and the other is `const enum`
 */
export type DT = DataType & DATATYPE

/** Validates a single DataType */
export function validDataType (dt: DataType | undefined | null): boolean {
  return typeof dt === 'number' && dt in DataType
}

/** Validates multiple DataTypes */
export function validMultiDataType (dt: DataType | DataType[] | undefined | null): boolean {
  return Array.isArray(dt) ? dt.every(validDataType) : validDataType(dt)
}
