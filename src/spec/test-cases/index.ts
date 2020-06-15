import { DataType } from '@lib';
import {
  invalidNumberUseCases,
  validArrayUseCases,
  validBooleanUseCases,
  validFunctionUseCases,
  validNullUseCases,
  validNumberNegativeUseCases,
  validNumberUseCases,
  validObjectUseCases,
  validStringUseCases,
  validSymbolPolyfilledUseCases,
  validSymbolUseCases,
  validUndefinedUseCases,
} from './non-schema';

const dataTypeTestCaseMap = {
  [DataType.number]: [
    ...validNumberUseCases,
    ...validNumberNegativeUseCases,
    ...invalidNumberUseCases,
  ],
  [DataType.string]: [...validStringUseCases],
  [DataType.boolean]: [...validBooleanUseCases],
  [DataType.function]: [...validFunctionUseCases],
  [DataType.array]: validArrayUseCases.slice().map((n) => n.test),
  [DataType.object]: [...validObjectUseCases],
  [DataType.undefined]: [...validUndefinedUseCases],
  [DataType.null]: [...validNullUseCases],
  [DataType.symbol]: [...validSymbolUseCases, ...validSymbolPolyfilledUseCases],
};

export function getDataTypeUseCases(
  exclusions: DataType | DataType[] = [],
  testCaseMap: { [k: number]: unknown[] } = dataTypeTestCaseMap
): unknown[] {
  /**
   * Ensure array of strings.
   * Strings are preferred because Object key iteration will convert keys to strings anyway.
   * DataType numeric keys will be converted to strings once validated.
   */
  const exclude: string[] = (<DataType[]>[])
    .concat(exclusions)
    .reduce<string[]>(
      (acc, k) => (typeof k === 'number' && k in DataType ? acc.concat(k.toString()) : acc),
      []
    );

  /**
   * Create array from sample data types.
   * Filters out exclusions and remaps into an array of arrays of sample data
   */
  return Object.keys(testCaseMap).reduce<unknown[]>(
    (acc, k) =>
      Object.prototype.hasOwnProperty.call(testCaseMap, k) &&
      k in DataType &&
      exclude.indexOf(k) === -1
        ? acc.concat(testCaseMap[+k])
        : acc,
    []
  );
}

/**
 * An array with all the non-named DataType keys.
 */
export const dataTypeKeys: number[] = Object.keys(DataType)
  .map((k) => parseInt(k, 10))
  .filter((k) => typeof k === 'number' && !isNaN(k));

/**
 * Guards against Symbol into string conversion errors
 */
export function safeString<T extends unknown>(value: T): T | string {
  return value ? (value as { toString: () => string }).toString() : value;
}

export * from './non-schema';
export * from './schema';
