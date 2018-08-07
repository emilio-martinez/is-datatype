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
export function is(val: undefined | null | boolean, type: DataType): boolean;
export function is(val: number, type: DataType, options?: isOptionsNumber): boolean;
export function is(val: string, type: DataType, options?: isOptionsString): boolean;
export function is(val: any[], type: DataType, options?: isOptionsArray): boolean;
export function is(val: object, type: DataType, options?: isOptionsObject): boolean;
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
  const opts = Options.ensure(options);

  /**
   * Check against typeof
   */
  const typeOfCheck =
    type === <DT>DATATYPE.number || type === <DT>DATATYPE.integer || type === <DT>DATATYPE.natural
      ? typeof val === DataType[DATATYPE.number] && !isNaN(val)
      : type === <DT>DATATYPE.array
        ? Array.isArray(val)
        : typeof val === DataType[type];

  if (!typeOfCheck) return false;

  /**
   * Object
   */
  if (type === <DT>DATATYPE.object) {
    return (
      (!Array.isArray(val) || opts.arrayAsObject === true) &&
      (opts.schema === null || matchesSchema(val, opts.schema))
    );
  }

  /**
   * Array
   */
  if (type === <DT>DATATYPE.array) {
    return (
      (val as any[]).every(n => isOneOfMultipleTypes(n, opts.type)) &&
      (opts.schema === null || matchesSchema(val, opts.schema)) &&
      testNumberWithinBounds((val as any[]).length, opts.min, opts.max)
    );
  }

  /**
   * String
   */
  if (type === <DT>DATATYPE.string) {
    return (
      (val.length > 0 || !opts.exclEmpty) &&
      typeof opts.pattern === 'string' &&
      new RegExp(opts.pattern, opts.patternFlags).test(val)
    );
  }

  /**
   * Number
   */
  if (type === <DT>DATATYPE.number) {
    return testNumberWithinBounds(val, opts.min, opts.max) && isMultipleOf(val, opts.multipleOf);
  }

  /**
   * Number special cases
   */
  if (type === <DT>DATATYPE.integer || type === <DT>DATATYPE.natural) {
    /** Immediately return false is `multipleOf` is passed, but it's not a multiple of 1. */
    if (!isMultipleOf(opts.multipleOf, 1)) return false;

    const multipleOf = opts.multipleOf === 0 ? 1 : opts.multipleOf;
    const min = type === <DT>DATATYPE.natural ? Math.max(0, opts.min) : opts.min;

    return testNumberWithinBounds(val, min, opts.max) && isMultipleOf(val, multipleOf);
  }

  /** All checks passed. */
  return true;
}

/**
 * Tests a value against a series of DataTypes (one or more).
 */
export function isOneOfMultipleTypes(
  val: any,
  type: DataType | DataType[],
  options?: isOptions
): boolean {
  return (<DataType[]>[]).concat(type).some(n => is(val, n, options));
}
