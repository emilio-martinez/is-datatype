import {
  isOptions,
  isOptionsArray,
  isOptionsNumber,
  isOptionsObject,
  isOptionsString,
  isTypeSchema
} from './is.interfaces'
import {
  DATATYPE,
  extendObject,
  isMultipleOf,
  isOneOfMultipleTypes,
  isValidOptions,
  matchesSchema,
  NEG_INF,
  POS_INF,
  testNumberWithinBounds,
  validDataType
} from './is.internal'

/**
 * The available data types that `is` can validate for.
 *
 * @export
 * @enum {number}
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
 * Merged type to help TS understand these enums have the same values
 * although one is a regular `enum` and the other is `const enum`
 */
type DT = DataType & DATATYPE

/**
 * Default option set to use within `is`
 */
const isDefaultOptions: isOptions = {
  type: <DT>DATATYPE.any,
  pattern: '[sS]*',
  patternFlags: '',
  exclEmpty: false,
  schema: null,
  allowNull: false,
  arrayAsObject: false,
  min: NEG_INF,
  max: POS_INF,
  exclMin: NEG_INF,
  exclMax: POS_INF,
  multipleOf: 0
}

/**
 * Type validation function meant to go beyond the use cases of operators
 * such as `typeof`.
 *
 * The data types available to test for are:
 *
 * * `boolean`
 * * `number`
 * * `integer`: Validates for numbers, restricting to only
 *   [integers](https://en.wikipedia.org/wiki/Integer);
 * * `natural`: Validates for numbers, restricting to only into
 *   [natural numbers](https://en.wikipedia.org/wiki/Natural_number),
 *   i.e., non-negative.
 * * `string`
 * * `function`
 * * `object`
 * * `array`
 * * `undefined`
 * * `any`: catch all
 *
 * This function is opinionated in the sense that:
 *
 * * When testing for `object` and `any`, `null` will be disallowed
 *   by default. If desired, an optional `allowNull` can be passed
 *   to allow that use case.
 * * When testing for an `object`, Arrays will be disallowed by default.
 *   If desired, an optional `arrayAsObject` can be passed to allow that
 *   use case. Note that there is a separate check for `array`.
 * * When testing for `number`, `integer`, or `natural`, `NaN` will
 *   be disallowed at all times.
 *
 * ## Options
 *
 * The default optional values are:
 *
 * ```ts
 * type: DataType.any // Used for `array` use cases
 * exclEmpty: false // Used for `string` use cases
 * schema: null // Used for `object` and `any` use cases
 * allowNull: false // Used for `object` and `any` use cases
 * arrayAsObject: false // Used for `object` use cases
 * min: Number.NEGATIVE_INFINITY // Used for `number` use cases
 * max: Number.POSITIVE_INFINITY // Used for `number` use cases
 * exclMin: Number.NEGATIVE_INFINITY // Used for `number` use cases
 * exclMax: Number.POSITIVE_INFINITY // Used for `number` use cases
 * multipleOf: 0 // Used for `number` use cases. `0` means no `multipleOf` check
 * ```
 *
 * ### String options
 *
 * Strings have an optional value to exclude empty values by passing
 * `exclEmpty` into the options, which is a `boolean`.
 *
 * ### Array options
 *
 * * `type`: `DataType|Array<DataType>`
 * * `min`: `number`
 * * `max`: `number`
 * * `exclMin`: `number`
 * * `exclMax`: `number`
 *
 * With the `type` option, arrays can be tested to see whether their
 * values are of a single type or one of multiple types, in which case
 * an array of types needs to be passed into the `type` option.
 * To clarify, this is strictly testing for "one of multiple types";
 * as long as a single one of the types passed validates as `true`,
 * then `is` will return `true`.
 *
 * Additionally, arrays can be tested to have a `min`, `max`, `exclMin`,
 * and `exclMax` lengths. `min` and `max` are inclusive in their checks
 * (`>=` and `<=`, respectively), where `exclMin` and `exclMax` are check
 * lengths exclusively (`<` and `>`, respectively).
 *
 * ### Number options
 *
 * * `min`: `number`
 * * `max`: `number`
 * * `exclMin`: `number`
 * * `exclMax`: `number`
 * * `multipleOf`: `number`
 *
 * As with Arrays, `exclMin` and `exclMax` are exclusive variants of
 * `min` and `max` with the exception of negative and positive infinity.
 *
 * `multipleOf` will check whether the number being evaluated is a
 * multiple of the value in this option. Please note that when negative
 * and positive infinities are used as the value to test for, the use of
 * `multipleOf` will result in `false` because using Infinity on the left
 * side of modulus is `NaN`.
 *
 * When checking for `integer` and `natural` the `number` options apply
 * as well, being that they are particular use cases of `number`.
 *
 * ## To do
 *
 * * Use cases for `symbol`
 *
 * @param {*} val - The value to test for.
 * @param {DataType} type - One of the DataType enum values
 * @param {isOptions} [options]
 * @returns {boolean}  Whether the validation is true or not
 */
export function is(val: undefined | boolean, type: DataType): boolean
export function is(val: number, type: DataType, options?: isOptionsNumber): boolean
export function is(val: string, type: DataType, options?: isOptionsString): boolean
export function is(val: any[], type: DataType, options?: isOptionsArray): boolean
export function is(val: Object, type: DataType, options?: isOptionsObject): boolean
export function is(val: any, type: DataType, options?: isOptions): boolean {
  /** Validate `type` */
  if (!validDataType(type)) {
    throw Error('Provided invalid `type` argument')
  }

  /** Validate `options` */
  if (!isValidOptions(options)) {
    throw Error('Provided invalid options object:' + JSON.stringify(options))
  }

  /** Combine passed options with default options. */
  const opts: isOptions = extendObject({}, isDefaultOptions, options)

  /**
   * Numeric particular use cases
   * All leverage the `number` check by setting the options their use case requires.
   */
  if (<DT>type === DATATYPE.integer || <DT>type === DATATYPE.natural) {
    /** Immediately return false is `multipleOf` is passed, but it's not a multiple of 1. */
    if (!isMultipleOf(opts.multipleOf, 1)) return false

    const numOptions: isOptions = { multipleOf: opts.multipleOf === 0 ? 1 : opts.multipleOf }

    if (<DT>type === DATATYPE.natural) {
      numOptions.min = opts.min !== undefined && opts.min >= 0 ? opts.min : 0
    }

    return is(val, <DT>DATATYPE.number, extendObject({}, opts, numOptions))
  }

  /**
   * Test for `null`
   * If it's not allowed, return `false`
   * If it's allowed, check for `any` or `object`
   */
  if (val === null) {
    return !opts.allowNull ? false : <DT>type === DATATYPE.any || <DT>type === DATATYPE.object
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
    <DT>type === DATATYPE.any
      ? true
      : <DT>type === DATATYPE.number
        ? typeof val === DataType[type] && !isNaN(val)
        : <DT>type === DATATYPE.array ? Array.isArray(val) : typeof val === DataType[type]
  if (!typeOfCheck) return false

  /**
   * If `array` is disallowed as object (default), check that the obj is not an array.
   * Is the schema option is set, the object will be validated against the schema.
   */
  if (<DT>type === DATATYPE.object) {
    return (
      (!Array.isArray(val) || opts.arrayAsObject === true) &&
      (opts.schema === null || matchesSchema(val, opts.schema as isTypeSchema | isTypeSchema[]))
    )
  }

  /**
   * If type is `array` and the `type` option is different than `any`,
   * check that all items in the array are of that type.
   */
  if (<DT>type === DATATYPE.array) {
    return (
      (val as any[]).every(n => isOneOfMultipleTypes(n, opts.type as DataType | DataType[])) &&
      (opts.schema === null || matchesSchema(val, opts.schema as isTypeSchema | isTypeSchema[])) &&
      testNumberWithinBounds((val as any[]).length, opts.min, opts.max, opts.exclMin, opts.exclMax)
    )
  }

  /** If type is `string` and empty is disallowed, check for an empty string. */
  if (<DT>type === DATATYPE.string) {
    return (
      (val.length > 0 || !opts.exclEmpty) &&
      typeof opts.pattern === 'string' &&
      new RegExp(opts.pattern, opts.patternFlags).test(val)
    )
  }

  /**
   * If type is `number` check against it's optional values.
   * If `exclMin` won't exclude Number.NEGATIVE_INFINITY.
   * If `exclMax` won't exclude Number.POSITIVE_INFINITY.
   * `multipleOf` will only be checked when different than 0.
   * When val is either negative or positive Infinity, `multipleOf` will be false.
   */
  if (<DT>type === DATATYPE.number) {
    return (
      testNumberWithinBounds(val, opts.min, opts.max, opts.exclMin, opts.exclMax) &&
      isMultipleOf(val, opts.multipleOf)
    )
  }

  /** All checks passed. */
  return true
}

export { isOptions } from './is.interfaces'
