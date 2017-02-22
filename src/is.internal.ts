import { is, DataType } from './is.func';
import { isOptions, isTypeSchema } from './is.interfaces';

/**
 * Tests whether a number is multiple of another number.
 * Keep in mind that Infinity, positive or negative, would return
 * NaN when using it with the modulus operator.
 *
 * @param {number} val
 * @param {number} multipleOf
 * @returns {boolean}
 */
export function isMultipleOf(val: number, multipleOf: number): boolean {
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
 * @export
 * @param {*} _val
 * @param {(isTypeSchema|Array<isTypeSchema>)} schema
 * @returns {boolean}
 */
export function matchesSchema(_val: any, schema: isTypeSchema|isTypeSchema[]): boolean {

  return (( Array.isArray(schema) ? schema : [ schema ] ) as isTypeSchema[])
    /** Test every schema until at least one of them matches */
    .some( (s: isTypeSchema) => {

      /** Get type. Use `any` if none is present */
      const _type: DataType|DataType[] = s.type ? s.type : DataType.any;

      /** Get the options, if any. Use objecct literal if not available. */
      const _typeOptions: isOptions = ( is(s.options as isOptions, DataType.object) ? s.options : {} ) as isOptions;

      /** Test if any of the data types matches */
      const _typeValid = isOneOfMultipleTypes( _val, _type, _typeOptions );

      /**
       * Whether the properties match what's reflected in the schema.
       * Initially assumed as `true`.
       */
      let _propsValid = true;

      /**
       * Whether the required properties are present.
       * Initially assumed as `true`.
       */
      let _reqdValid = true;

      /** Extract the properties to test for into an array */
      const _propKeys: string[] = ( is(s.props as isOptions, DataType.object) ? Object.keys(s.props) : [] );

      /** Begin tests relevat to properties */
      if ( _propKeys.length > 0 ) {

        /**
         * Get all keys that are required from the schema,
         * and then test for required propertes.
         */
        _reqdValid = _propKeys
          .filter( p => s.props && s.props[p] && s.props[p].required === true )
          .every( r => _val[r] !== undefined );

        /**
         * Iterate over the property keys.
         *
         * If the subject has the property we're seeking,
         * `matchesSchema` is called on that property.
         *
         * If `p`, the property, is not an object, it won't be validated against.
         * However, if it was required, that will have been caught by the check above.
         */
        _propsValid = _propKeys
          .every( p => ( !!s.props && _val !== undefined && _val[p] !== undefined ? matchesSchema(_val[p], s.props[p]) : true ) );
      }

      /** Test items if `array` */
      let _itemsValid = true;
      if ( _type === DataType.array && _typeValid && s.items !== undefined ) {
        _itemsValid = (_val as any[]).every( i => matchesSchema(i, s.items as isTypeSchema|isTypeSchema[]) );
      }

      return _typeValid && _reqdValid && _propsValid && _itemsValid;
    });
}

/**
 * Tests a value against a series of DataTypes (one or more).
 *
 * @param {*} val
 * @param {(DataType|Array<DataType>)} type
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
 * @export
 * @param {*} dest
 * @param {...Array<any>} sources
 * @returns {*}
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