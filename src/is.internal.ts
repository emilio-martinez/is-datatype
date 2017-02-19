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