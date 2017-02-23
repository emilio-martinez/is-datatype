import {
  isOptions,
  isOptionsArray,
  isOptionsNumber,
  isOptionsObject,
  isOptionsString,
  isTypeSchema,
} from './is.interfaces';
import {
  isMultipleOf,
  matchesSchema,
  isOneOfMultipleTypes,
  extendObject,
  isValidOptions,
} from './is.internal';

/**
 * The available data types that `is` can validate for.
 *
 * @export
 * @enum {number}
 */
export enum DataType {
  boolean,
  number,
  integer,
  natural,
  string,
  function,
  object,
  array,
  undefined,
  any
};

/** Reference to positive infinity */
const p_infinity = Number.POSITIVE_INFINITY;

/** Reference to negative infinity */
const n_infinity = Number.NEGATIVE_INFINITY;

/**
 * Default option set to use within `is`
 */
const isDefaultOptions: isOptions = {
  type: DataType.any,
  pattern: '[\s\S]*',
  patternFlags: '',
  exclEmpty: false,
  schema: null,
  allowNull: false,
  arrayAsObject: false,
  min: n_infinity,
  max: p_infinity,
  exclMin: n_infinity,
  exclMax: p_infinity,
  multipleOf: 0
};

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
export function is(val: undefined, type: DataType): boolean;
export function is(val: boolean, type: DataType): boolean;
export function is(val: number, type: DataType, options?: isOptionsNumber): boolean;
export function is(val: string, type: DataType, options?: isOptionsString): boolean;
export function is(val: any[], type: DataType, options?: isOptionsArray): boolean;
export function is(val: Object, type: DataType, options?: isOptionsObject): boolean;
export function is(val: any, type: DataType, options?: isOptions): boolean {

  /** Check options */
  if(options !== undefined && !isValidOptions(options as isOptions)) {
    throw `Provided invalid options object when testing for ${JSON.stringify(val)}: ${JSON.stringify(options)}`;
  }

  /** Combine passed options with default options. */
  const _options: isOptions = extendObject({}, isDefaultOptions, options);

  /**
   * Numeric particular use cases
   * All leverage the `number` check by setting the options their use case requires.
   */
  if ( type === DataType.integer || type === DataType.natural ) {
    /** Immediately return false is `multipleOf` is passed, but it's not a multiple of 1. */
    if ( !isMultipleOf(_options.multipleOf as number, 1) ) return false;

    let numOptions: isOptions = { multipleOf: ( _options.multipleOf === 0 ? 1 : _options.multipleOf ) };
    if ( type === DataType.natural ) numOptions.min = ( _options.min !== undefined && _options.min >= 0 ? _options.min : 0 );

    return is((val as number), DataType.number, extendObject({}, _options, numOptions) );
  };

  /** If `allowNull` is true and type is `any` or val is `null`, return true. */
  if ( _options.allowNull && ( type === DataType.any || val === null ) ) return true;

  /** If `allowNull` is false and val is `null`, return false. */
  if ( !_options.allowNull && val === null ) return false;

  /**
   * If `any` type, always true.
   * If `number` type, check it's a number other than NaN.
   * If `array` type, check it's an `object` type.
   * Otherwise, do a check against the passed type.
   *
   * If `typeOfCheck` is false, return false.
   */
  const typeOfCheck = (
    type === DataType.any ? true :
    type === DataType.number ? typeof val === DataType[type] && !isNaN(val) :
    type === DataType.array ? typeof val === DataType[DataType.object] && Array.isArray(val) :
    typeof val === DataType[type]
  );
  if (!typeOfCheck) return false;


  /**
   * If `array` is disallowed as object (default), check that the obj is not an array.
   * Is the schema option is set, the object will be validated against the schema.
   */
  if ( type === DataType.object ) {
    return (
      ( !Array.isArray(val) || _options.arrayAsObject as boolean ) &&
      ( _options.schema === null || matchesSchema(val, _options.schema as isTypeSchema|isTypeSchema[]) )
    );
  }

  /**
   * If type is `array` and the `type` option is different than `any`,
   * check that all items in the array are of that type.
   */
  if ( type === DataType.array) {
    return (
      (val as any[]).every( n => isOneOfMultipleTypes(n, _options.type as DataType|DataType[]) ) &&
      ( _options.schema === null || matchesSchema(val, _options.schema as isTypeSchema|isTypeSchema[]) ) &&
      ( _options.min !== undefined && (val as any[]).length >= _options.min ) &&
      ( _options.max !== undefined && (val as any[]).length <= _options.max ) &&
      ( _options.exclMin === n_infinity || ( _options.exclMin !== undefined && (val as any[]).length > _options.exclMin) ) &&
      ( _options.exclMax === p_infinity || ( _options.exclMax !== undefined && (val as any[]).length < _options.exclMax) )
    );
  }

  /** If type is `string` and empty is disallowed, check for an empty string. */
  if ( type === DataType.string ) {
    return (
      ( !((val as string).length === 0 ) || !_options.exclEmpty ) &&
      ( new RegExp(_options.pattern as string, _options.patternFlags) ).test(val)
    );
  }

  /**
   * If type is `number` check against it's optional values.
   * If `exclMin` won't exclude Number.NEGATIVE_INFINITY.
   * If `exclMax` won't exclude Number.POSITIVE_INFINITY.
   * `multipleOf` will only be checked when different than 0.
   * When val is either negative or positive Infinity, `multipleof` will be false.
   */
  if( type === DataType.number) {
    return (
      ( _options.min !== undefined && (val as number) >= _options.min ) &&
      ( _options.max !== undefined && (val as number) <= _options.max ) &&
      ( _options.exclMin === n_infinity || ( _options.exclMin !== undefined && (val as number) > _options.exclMin) ) &&
      ( _options.exclMax === p_infinity || ( _options.exclMax !== undefined && (val as number) < _options.exclMax) ) &&
      isMultipleOf(val, _options.multipleOf as number)
    );
  }

  /** All checks passed. */
  return true;
}

export { isOptions } from './is.interfaces';
