
export enum DataType { boolean, number, integer, natural, string, function, object, array, undefined, any };

export interface isTypeSchema {
  type?: DataType|DataType[]
  props?: ({ [k: string]: isTypeSchema });
  items?: isTypeSchema|isTypeSchema[];
  required?: boolean;
  options?: isOptions;
}

export interface isOptions {
  type?: DataType|DataType[];
  pattern?: string;
  patternFlags?: string;
  exclEmpty?: boolean;
  schema?: isTypeSchema|isTypeSchema[];
  allowNull?: boolean;
  arrayAsObject?: boolean;
  min?: number;
  max?: number;
  exclMin?: number;
  exclMax?: number;
  multipleOf?: number;
}

const isDefaultOptions: isOptions = {
  type: DataType.any,
  pattern: '[\s\S]*',
  patternFlags: '',
  exclEmpty: false,
  schema: null,
  allowNull: false,
  arrayAsObject: false,
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
  exclMin: Number.NEGATIVE_INFINITY,
  exclMax: Number.POSITIVE_INFINITY,
  multipleOf: 0
};

/**
 * Validation function.
 *
 * The data types available to test for are: `boolean`, `number`, `integer`, `natural`,
 * `string`, `function`, `object`, `array`, `undefined`, and `any`. `natural`, possibly
 * the most uncommon term within these, refers to natural numbers, i.e., non-negative.
 *
 * This function is opinionated in the sense that:
 *
 * - When testing for `object` and `any`, `null` will be disallowed by default.
 *   If desired, an optional `allowNull` can be passed to allow that use case.
 * - When testing for an `object`, Arrays will be disallowed by default.
 *   If desired, an optional `arrayAsObject` can be passed to allow that use case.
 *   Note that there is a separate check for `array`.
 * - When testing for `number`, `integer`, or `natural`, NaN will be disallowed
 *   at all times.
 *
 * Strings have an optional value to exclude empty arrays: `exclEmpty`.
 *
 * Arrays have an optional value to test for the array being of a single data type
 * as well as multiple "whitelisted" data types. That can be achieved by passing
 * the `type` option in the `options` param. When testing for a single, the DataType
 * on its own is sufficient, and when testing for several, an array for DataType items
 * is required. Additionally, arrays can be tested to have a `min`, `max`, `exclMin`,
 * and `exclMax` lengths.
 *
 * Numbers have the following options: `min`, `max`, `exclMin`, `exclMax` and `multipleOf`.
 * `exclMin` and `exclMax` are exclusive variants of `min` and `max` with the exception
 * of negative and positive infinity. `multipleOf` will check whether the number being
 * evaluated is a multiple of the value in this option. Please note that whe negative and
 * positive infinities are used as the value to test for, the use of `multipleOf` will
 * result in `false` because using Ininity on the left side of modulus is NaN.
 * When checking for `integer` and `natural` the `number` options apply as well, being
 * that it is a particular use case of `number`.
 *
 * The default optional values are:
 *
 * ```
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
 * TODO:
 * - Add `schema` option to `array`
 * - Use cases for `symbol`
 *
 * @param {any} val  The value to test for.
 * @param {DataType} type  One of the DataType enum values
 * @returns {boolean}  Whether the validation is true or not
 */
export function is(val: undefined, type: DataType): boolean;
export function is(val: boolean, type: DataType): boolean;
export function is(val: number, type: DataType, options?: { min?: number, max?:number, exclMin?: number, exclMax?: number, multipleOf?: number }): boolean;
export function is(val: string, type: DataType, options?: { pattern?: string, patternFlags?: string, exclEmpty?: boolean }): boolean;
export function is(val: any[], type: DataType, options?: { schema?: isTypeSchema|isTypeSchema[], type?: DataType|DataType[], min?: number, max?:number, exclMin?: number, exclMax?: number }): boolean;
export function is(val: Object, type: DataType, options?: { schema?: isTypeSchema|isTypeSchema[], allowNull?: boolean, arrayAsObject?: boolean }): boolean;
export function is(val: any, type: DataType, options?: isOptions): boolean {

  /** Combine passed options with default options. */
  const _options: isOptions = extendObject({}, isDefaultOptions, options);

  /**
   * Numeric particular use cases
   * All leverage the `number` check by setting the options their use case requires.
   */
  if ( type === DataType.integer || type === DataType.natural ) {
    /** Immediately return false is `multipleOf` is passed, but it's not a multiple of 1. */
    if ( !isMultipleOf(_options.multipleOf, 1) ) return false;

    let numOptions: isOptions = { multipleOf: ( _options.multipleOf === 0 ? 1 : _options.multipleOf ) };
    if ( type === DataType.natural ) numOptions.min = ( _options.min >= 0 ? _options.min : 0 );

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
      ( !Array.isArray(val) || _options.arrayAsObject ) &&
      ( _options.schema === null || matchesSchema(val, _options.schema) )
    );
  }

  /**
   * If type is `array` and the `type` option is different than `any`,
   * check that all items in the array are of that type.
   */
  if ( type === DataType.array) {
    return (
      (val as any[]).every( n => isOneOfMultipleTypes(n, _options.type) ) &&
      ( _options.schema === null || matchesSchema(val, _options.schema) ) &&
      (val as any[]).length >= _options.min &&
      (val as any[]).length <= _options.max &&
      ( _options.exclMin === Number.NEGATIVE_INFINITY || (val as any[]).length > _options.exclMin ) &&
      ( _options.exclMax === Number.POSITIVE_INFINITY || (val as any[]).length < _options.exclMax )
    );
  }

  /** If type is `string` and empty is disallowed, check for an empty string. */
  if ( type === DataType.string ) {
    return (
      ( !((val as string).length === 0 ) || !_options.exclEmpty ) &&
      ( new RegExp(_options.pattern, _options.patternFlags) ).test(val)
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
      (val as number) >= _options.min &&
      (val as number) <= _options.max &&
      ( _options.exclMin === Number.NEGATIVE_INFINITY || (val as number) > _options.exclMin ) &&
      ( _options.exclMax === Number.POSITIVE_INFINITY || (val as number) < _options.exclMax ) &&
      isMultipleOf(val, _options.multipleOf)
    );
  }

  /** All checks passed. */
  return true;
}

/**
 * Tests whether a number is multiple of another number.
 * Keep in mind that Infinity, positive or negative, would return
 * NaN when using it with the modulus operator.
 *
 * @param {number} val
 * @param {number} multipleOf
 * @returns {boolean}
 */
function isMultipleOf(val: number, multipleOf: number): boolean {
  return (
    multipleOf === 0 ||
    ( val !== Number.NEGATIVE_INFINITY &&
      val !== Number.POSITIVE_INFINITY &&
      // Using Math.abs avoids `-0`
      Math.abs( (val as number) % multipleOf ) === 0
    )
  );
}

/**
 * Tests an object against an object schema.
 *
 * @param {Object} obj
 * @param {(isTypeSchema)} schema
 * @returns {boolean}
 */
export function matchesSchema(_val: any, schema: isTypeSchema|isTypeSchema[]): boolean {

  return (( Array.isArray(schema) ? schema : [ schema ] ) as isTypeSchema[])
    .some( s => {

      const _type = s.type ? s.type : DataType.any; // Use any if no type is present.
      const _typeOptions = ( is(s.options, DataType.object) ? s.options : {} );
      /** Test for type */
      const _typeValid = isOneOfMultipleTypes( _val, _type, _typeOptions );

      /** Test for properties */
      let _propsValid = true;
      let _reqdValid = true;
      const _props = ( is(s.props, DataType.object) ? Object.keys(s.props) : [] );
      if ( _props.length > 0 ) {

        /** Get all keys that are required from the schema */
        /** Test for `required` props */
        _reqdValid = _props
          .filter( p => s.props[p].required === true )
          .every( r => _val[r] !== undefined );

        /**
         * Iterate over the `props` keys
         * If `obj` has `p` property, call `matchesSchema` on that property of the object.
         * The schema will be the value of `p` on the schema props.
         *
         * NOTE: if `p` is not in object, we don't validate; however, if it's required,
         * it'll be caught because that's being validated above
         */
        _propsValid = _props
          .every( p => ( _val !== undefined && _val[p] !== undefined ? matchesSchema(_val[p], s.props[p]) : true ) );
      }

      /** Test items if `array` */
      let _itemsValid = true;
      if ( _type === DataType.array && _typeValid && s.items !== undefined ) {
        _itemsValid = (_val as any[]).every( i => matchesSchema(i, s.items) );
      }

      return _typeValid && _reqdValid && _propsValid && _itemsValid;
    });
}

/**
 * Tests a value against a series of DataTypes (one or more).
 *
 * @param {*} val
 * @param {(DataType|DataType[])} type
 * @param {isOptions} [options]
 * @returns {boolean}
 */
export function isOneOfMultipleTypes(val: any, type: DataType|DataType[], options?: isOptions): boolean {
  /** Coerce `DataType` into an array */
  let types = ( Array.isArray(type) ? type : [ type ] );

  /** Check for presence of `any` */
  if ( types.indexOf(DataType.any) !== -1 ) return true;

  /** Filter out non-`DataType` items */
  types = types.filter( v => typeof v === 'number' && (DataType as any).hasOwnProperty(v) );

  /** Test `val` prop against type validation */
  return ( types.length === 0 ? false : types.some( n => is(val, n, options) ) );
}

/**
 * Extends an object with the *enumerable* and *own* properties of one or more source objects,
 * similar to Object.assign.
 *
 * @param dest The object which will have properties copied to it.
 * @param sources The source objects from which properties will be copied.
 */
export function extendObject(dest: any, ...sources: any[]): any {
  if (dest == null) {
    throw TypeError('Cannot convert undefined or null to object');
  }

  for (let source of sources) {
    if (source != null) {
      for (let key in source) {
        if (source.hasOwnProperty(key)) {
          dest[key] = source[key];
        }
      }
    }
  }

  return dest;
}