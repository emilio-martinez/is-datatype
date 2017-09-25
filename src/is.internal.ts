import { is, DataType } from './is.func'
import { isOptions, isTypeSchema } from './is.interfaces'

/**
 * CONSTANTS
 * These tokes are used a lot in this package,
 * therefore aliasing reduces weight on minification
 */
export const POS_INF = Number.POSITIVE_INFINITY
export const NEG_INF = Number.NEGATIVE_INFINITY

export const enum DATATYPE {
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
 * Strict check for whether a value is defined
 *
 * @param {*} v
 * @returns {boolean}
 */
export function isDefined(v: any): boolean {
  return v !== undefined
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
export function isMultipleOf(val: number, multipleOf: number): boolean {
  return (
    multipleOf === 0 ||
    (val !== NEG_INF &&
      val !== POS_INF &&
      // Using Math.abs avoids `-0`
      Math.abs((val as number) % multipleOf) === 0)
  )
}

/**
 * Tests a value within bounds of min, max, exclusive min and exclusive max
 *
 * @export
 * @param {number} val
 * @param {(number | undefined)} min
 * @param {(number | undefined)} max
 * @param {(number | undefined)} exclMin
 * @param {(number | undefined)} exclMax
 * @returns {boolean}
 */
export function testNumberWithinBounds(
  val: number,
  min: number | undefined,
  max: number | undefined,
  exclMin: number | undefined,
  exclMax: number | undefined
): boolean {
  return (
    // prettier-ignore
    (isDefined(min) && val >= min!) &&
    (isDefined(max) && val <= max!) &&
    (exclMin === NEG_INF || (isDefined(exclMin) && val > exclMin!)) &&
    (exclMax === POS_INF || (isDefined(exclMax) && val < exclMax!))
  )
}

/**
 * Tests whether a value is primitive or not
 *
 * @export
 * @param {*} val
 * @returns {boolean}
 */
export function isPrimitive(val: any): boolean {
  const t = typeof val
  return val == null || (t != 'function' && t != 'object')
}

/**
 * Tests an object against an object schema.
 *
 * @export
 * @param {*} _val
 * @param {(isTypeSchema|Array<isTypeSchema>)} schema
 * @returns {boolean}
 */
export function matchesSchema(_val: any, schema: isTypeSchema | isTypeSchema[]): boolean {
  return (
    ((Array.isArray(schema) ? schema : [schema]) as isTypeSchema[])
      /** Test every schema until at least one of them matches */
      .some((s: isTypeSchema) => {
        /** If type is defined but invalid, schema is false */
        if (isDefined(s.type) && !validDataType(s.type)) return false

        /** Cache the type. Use `any` if none is present */
        const _type: DataType | DataType[] = !isDefined(s.type) ? <DT>DATATYPE.any : s.type as DataType | DataType[]

        /** Get the options, if any. Use object literal if not available. */
        const _typeOptions: isOptions = (isValidOptions(s.options) ? s.options : {}) as isOptions

        /** Test if any of the data types matches */
        const _typeValid = isOneOfMultipleTypes(_val, _type, _typeOptions)

        /**
         * Whether the properties match what's reflected in the schema.
         * Initially assumed as `true`.
         */
        let _propsValid = true

        /**
         * Whether the required properties are present.
         * Initially assumed as `true`.
         */
        let _reqdValid = true

        /** Extract the properties to test for into an array */
        const _propKeys: string[] = is(s.props as isOptions, <DT>DATATYPE.object) ? Object.keys(s.props as object) : []

        /** Begin tests relevant to properties */
        if (_propKeys.length > 0) {
          /**
           * Get all keys that are required from the schema,
           * and then test for required properties.
           */
          _reqdValid = _propKeys
            .filter(p => s.props && s.props[p] && s.props[p].required === true)
            .every(r => isDefined(_val[r]))

          /**
           * Iterate over the property keys.
           *
           * If the subject has the property we're seeking,
           * `matchesSchema` is called on that property.
           *
           * If `p`, the property, is not an object, it won't be validated against.
           * However, if it was required, that will have been caught by the check above.
           */
          _propsValid = _propKeys.every(
            p => (!!s.props && isDefined(_val) && isDefined(_val[p]) ? matchesSchema(_val[p], s.props[p]) : true)
          )
        }

        /**
         * Whether Array items are valid
         * Initially assumed as `true`.
         */
        let _itemsValid = true
        /** If `type` is Any, check whether value is array. If so, check items */
        const inferredArray = _type == <DT>DATATYPE.any && Array.isArray(_val)

        if ((_type == <DT>DATATYPE.array || inferredArray) && _typeValid && isDefined(s.items)) {
          _itemsValid = (_val as any[]).every(i => matchesSchema(i, s.items as isTypeSchema | isTypeSchema[]))
        }

        return _typeValid && _reqdValid && _propsValid && _itemsValid
      })
  )
}

/**
 * Tests a value against a series of DataTypes (one or more).
 *
 * @param {*} val
 * @param {(DataType|Array<DataType>)} type
 * @param {isOptions} [options]
 * @returns {boolean}
 */
export function isOneOfMultipleTypes(val: any, type: DataType | DataType[], options?: isOptions): boolean {
  /** Coerce `DataType` into an array and filter out non-`DataType` items */
  let types = (Array.isArray(type) ? type : [type]).filter(validDataType)

  /**
   * If no length, return false
   * Else if `types` contain any, return true
   * Else test against `is`
   */
  return types.length ? types.indexOf(<DT>DATATYPE.any) >= 0 || types.some(n => is(val, n, options)) : false
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
    throw TypeError('Cannot convert undefined or null to object')
  }

  for (let source of sources) {
    if (source != null) {
      for (let key in source) {
        if (source.hasOwnProperty(key)) {
          dest[key] = source[key]
        }
      }
    }
  }

  return dest
}

/**
 * Validates whether an options object is valid or not.
 * Invalid values will be set to the default option values.
 *
 * @export
 * @param {isOptions} _op
 * @returns {boolean}
 */
export function isValidOptions(_op: isOptions | undefined): boolean {
  /** Ensure object */
  const op = (isDefined(_op) && is(_op as isOptions, <DT>DATATYPE.object) ? _op : {}) as isOptions

  /**
   * Test every property.
   * If even a single option is wrong, no pass.
   */
  return Object.keys(op).every(o => {
    /** DataType case */
    if (o == 'type') {
      return validDataType(op[o])
    }

    /** string cases */
    if (o == 'pattern' || o == 'patternFlags') {
      return typeof op[o] == 'string'
    }

    /** Boolean cases */
    if (o == 'exclEmpty' || o == 'allowNull' || o == 'arrayAsObject') {
      return typeof op[o] == 'boolean'
    }

    /** Number cases */
    if (o == 'min' || o == 'max' || o == 'exclMin' || o == 'exclMax' || o == 'multipleOf') {
      return typeof op[o] == 'number' && !isNaN(op[o] as number)
    }

    /** Schema case */
    if (o == 'schema') {
      return (
        op[o] === null ||
        matchesSchema(op[o], {
          /** `isTypeSchema` is always an object */
          type: <DT>DATATYPE.object,
          props: {
            type: {
              type: [<DT>DATATYPE.number, <DT>DATATYPE.array],
              items: { type: <DT>DATATYPE.number }
            },
            props: { type: <DT>DATATYPE.object },
            items: {
              type: [<DT>DATATYPE.object, <DT>DATATYPE.array],
              items: { type: <DT>DATATYPE.object }
            },
            required: { type: <DT>DATATYPE.boolean },
            options: { type: <DT>DATATYPE.object }
          }
        })
      )
    }

    return true
  })
}

/**
 * Checks for whether an item is a valid option in the DataType enum
 * @export
 * @param {(number|string|(number|string)[]|undefined)} _val
 * @returns {boolean}
 */
export function validDataType(val: number | string | (number | string)[] | undefined): boolean {
  function check(val: number | string | undefined) {
    return typeof val == 'number' && val in DataType
  }

  return Array.isArray(val) ? val.every(check) : check(val)
}
