import { DataType } from '../../src/data-type';
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
  validUndefinedUseCases
} from './non-schema.spec';

const dataTypeTestCaseMap = {
  [DataType.number]: [
    ...validNumberUseCases,
    ...validNumberNegativeUseCases,
    ...invalidNumberUseCases
  ],
  [DataType.string]: [...validStringUseCases],
  [DataType.boolean]: [...validBooleanUseCases],
  [DataType.function]: [...validFunctionUseCases],
  [DataType.array]: validArrayUseCases.slice().map(n => n.test),
  [DataType.object]: [...validObjectUseCases],
  [DataType.undefined]: [...validUndefinedUseCases],
  [DataType.null]: [...validNullUseCases]
};

export function getDataTypeUseCases(
  exclusions?: DataType | DataType[],
  testCaseMap: { [k: number]: any[] } = dataTypeTestCaseMap
): any[] {
  /**
   * Ensure array of strings.
   * Strings are preferred because Object key iteration will convert keys to strings anyway.
   * DataType numeric keys will be converted to strings once validated.
   */
  const exclude: string[] = (Array.isArray(exclusions) ? exclusions : [exclusions])
    .filter(k => typeof k === 'number' && k in DataType)
    .map(k => k.toString());

  /**
   * Create array from sample data types.
   * Filters out exclusions and remaps into an array of arrays of sample data
   */
  return Object.keys(testCaseMap)
    .filter(k => testCaseMap.hasOwnProperty(k) && k in DataType && exclude.indexOf(k) === -1)
    .map(k => testCaseMap[k])
    .reduce((a, b) => a.concat(b), []);
}

/**
 * An array with all the non-named DataType keys.
 */
export const dataTypeKeys: number[] = Object.keys(DataType)
  .map(k => parseInt(k, 10))
  .filter(k => typeof k === 'number' && !isNaN(k));

export * from './non-schema.spec';
export * from './schema.spec';
