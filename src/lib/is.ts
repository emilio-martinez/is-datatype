import {
  isOptions,
  isOptionsArray,
  isOptionsNumber,
  isOptionsObject,
  isOptionsString,
  StrictOptions
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

  /** Any */
  if (<DT>type === DATATYPE.any) return true;

  /** Undefined */
  if (<DT>type === DATATYPE.undefined || val === undefined) {
    return <DT>type === DATATYPE.undefined && val === undefined;
  }

  /** Null */
  if (<DT>type === DATATYPE.null || val === null) {
    return <DT>type === DATATYPE.null && val === null;
  }

  /** Sanitize options object */
  const opts = Options.ensure(options);

  /**
   * Numeric particular use cases
   * All leverage the `number` check by setting the options their use case requires.
   */
  if (<DT>type === DATATYPE.integer || <DT>type === DATATYPE.natural) {
    /** Immediately return false is `multipleOf` is passed, but it's not a multiple of 1. */
    if (!isMultipleOf(opts.multipleOf, 1)) return false;

    const numOptions: StrictOptions = opts;
    numOptions.multipleOf = numOptions.multipleOf === 0 ? 1 : numOptions.multipleOf;
    if (<DT>type === DATATYPE.natural) numOptions.min = Math.max(0, numOptions.min);

    return is(val, <DT>DATATYPE.number, numOptions);
  }

  /**
   * If `any` type, always true.
   * If `number` type, check it's a number other than NaN.
   * If `array` type, check it's an `object` type.
   * Otherwise, do a check against the passed type.
   *
   * If `typeOfCheck` is false, return false.
   */
  const typeOfCheck =
    <DT>type === DATATYPE.number
      ? typeof val === DataType[type] && !isNaN(val)
      : <DT>type === DATATYPE.array
        ? Array.isArray(val)
        : typeof val === DataType[type];
  if (!typeOfCheck) return false;

  /**
   * If `array` is disallowed as object (default), check that the obj is not an array.
   * Is the schema option is set, the object will be validated against the schema.
   */
  if (<DT>type === DATATYPE.object) {
    return (
      (!Array.isArray(val) || opts.arrayAsObject === true) &&
      (opts.schema === null || matchesSchema(val, opts.schema))
    );
  }

  /**
   * If type is `array` and the `type` option is different than `any`,
   * check that all items in the array are of that type.
   */
  if (<DT>type === DATATYPE.array) {
    return (
      (val as any[]).every(n => isOneOfMultipleTypes(n, opts.type)) &&
      (opts.schema === null || matchesSchema(val, opts.schema)) &&
      testNumberWithinBounds((val as any[]).length, opts.min, opts.max)
    );
  }

  /** If type is `string` and empty is disallowed, check for an empty string. */
  if (<DT>type === DATATYPE.string) {
    return (
      (val.length > 0 || !opts.exclEmpty) &&
      typeof opts.pattern === 'string' &&
      new RegExp(opts.pattern, opts.patternFlags).test(val)
    );
  }

  /**
   * If type is `number` check against it's optional values.
   * `multipleOf` will only be checked when different than 0.
   * When val is either negative or positive Infinity, `multipleOf` will be false.
   */
  if (<DT>type === DATATYPE.number) {
    return testNumberWithinBounds(val, opts.min, opts.max) && isMultipleOf(val, opts.multipleOf);
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
  /** Coerce `DataType` into an array and filter out non-`DataType` items */
  const types = (<DataType[]>[]).concat(type);

  /**
   * If no length, return false
   * Else if `types` contain any, return true
   * Else test against `is`
   */
  return types.some(n => is(val, n, options));
}
