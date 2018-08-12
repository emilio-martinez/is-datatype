import {
  isOptions,
  isOptionsArray,
  isOptionsNumber,
  isOptionsObject,
  isOptionsString
} from './interfaces';
import { matchesSchema } from './schema';
import { isMultipleOf, testNumberWithinBounds } from './number-helpers';
import { DATATYPE, DataType, DT, validDataType } from './data-type';
import { Options } from './options';

/**
 * Type validation function meant to go beyond the use cases of operators such as `typeof`.
 */
export function is(val: undefined, type: DataType): val is undefined;
export function is(val: null, type: DataType): val is null;
export function is(val: boolean, type: DataType): val is boolean;
export function is(val: number, type: DataType, options?: isOptionsNumber): val is number;
export function is(val: string, type: DataType, options?: isOptionsString): val is string;
export function is<T = any>(val: T[], type: DataType, options?: isOptionsArray): val is T[];
export function is(val: object, type: DataType, options?: isOptionsObject): val is object;
export function is(val: any, type: DataType, options?: isOptions): boolean {
  if (!validDataType(type)) {
    throw TypeError('Invalid `type` argument.');
  }

  /**
   * Any
   */
  if (type === <DT>DATATYPE.any) return true;

  /**
   * Undefined
   */
  if (type === <DT>DATATYPE.undefined || val === undefined) {
    return type === <DT>DATATYPE.undefined && val === undefined;
  }

  /**
   * Null
   */
  if (type === <DT>DATATYPE.null || val === null) {
    return type === <DT>DATATYPE.null && val === null;
  }

  /**
   * Sanitize options
   */
  const opts = new Options(options);

  /**
   * Check against typeof
   */
  const typeOfCheck = typeof val === DataType[type];
  let isSpecialNumericType = false;

  switch (type) {
    case <DT>DATATYPE.object:
      return (
        typeOfCheck &&
        (!Array.isArray(val) || opts.arrayAsObject === true) &&
        matchesSchema(val, opts.schema)
      );
    case <DT>DATATYPE.array:
      return (
        Array.isArray(val) &&
        val.every(n => isOneOfMultipleTypes(n, opts.type)) &&
        matchesSchema(val, opts.schema) &&
        testNumberWithinBounds(val.length, opts.min, opts.max)
      );
    case <DT>DATATYPE.string:
      return (
        typeOfCheck &&
        (val.length > 0 || !opts.exclEmpty) &&
        typeof opts.pattern === 'string' &&
        new RegExp(opts.pattern, opts.patternFlags).test(val)
      );
    case <DT>DATATYPE.integer:
    case <DT>DATATYPE.natural:
      isSpecialNumericType = true;
    // tslint:disable-next-line:no-switch-case-fall-through
    case <DT>DATATYPE.number: {
      /** Ensure multiple of 1 for integer and natural cases */
      if (isSpecialNumericType && !isMultipleOf(opts.multipleOf, 1)) return false;

      const multipleOf = isSpecialNumericType && opts.multipleOf === 0 ? 1 : opts.multipleOf;
      const min = type === <DT>DATATYPE.natural ? Math.max(0, opts.min) : opts.min;

      return (
        typeof val === DataType[DATATYPE.number] &&
        !isNaN(val) &&
        testNumberWithinBounds(val, min, opts.max) &&
        isMultipleOf(val, multipleOf)
      );
    }
  }

  /** All checks passed. */
  return typeOfCheck;
}

/**
 * Tests a value against a series of DataTypes (one or more).
 */
export function isOneOfMultipleTypes(val: any, type: DataType | DataType[], options?: isOptions) {
  return (<DataType[]>[]).concat(type).some(n => is(val, n, options));
}
