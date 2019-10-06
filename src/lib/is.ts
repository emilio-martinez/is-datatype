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
import { likelySymbol } from './symbol-helpers';

export type isOptionsParamType<D extends DataType> = D extends DataType.array
  ? isOptionsArray
  : D extends DataType.number
  ? isOptionsNumber
  : D extends DataType.string
  ? isOptionsString
  : D extends DataType.object
  ? isOptionsObject
  : D extends (DataType.undefined | DataType.null | DataType.boolean | DataType.symbol)
  ? never
  : isOptions;

/**
 * Type validation function meant to go beyond the use cases of operators such as `typeof`.
 */
export function is<T, D extends DataType>(
  val: T,
  type: D,
  options?: isOptionsParamType<D>
): val is T {
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
        !likelySymbol(val as any) &&
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
        (((val as unknown) as string).length > 0 || !opts.exclEmpty) &&
        typeof opts.pattern === 'string' &&
        new RegExp(opts.pattern, opts.patternFlags).test((val as unknown) as string)
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
        !isNaN((val as unknown) as number) &&
        testNumberWithinBounds((val as unknown) as number, min, opts.max) &&
        isMultipleOf((val as unknown) as number, multipleOf)
      );
    }
    case <DT>DATATYPE.symbol:
      return typeOfCheck || likelySymbol(val as any);
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
