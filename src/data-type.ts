/**
 * The available data types that `is` can validate for.
 */
export enum DataType {
  any = -1,
  // Primitives
  undefined = 1,
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

/**
 * Checks for whether an item is a valid option in the DataType enum
 */
export function validDataType (val: any | any[] | undefined): boolean {
  function check (val: any | undefined) {
    return typeof val === 'number' && val in DataType
  }

  return Array.isArray(val) ? val.every(check) : check(val)
}
