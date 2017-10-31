import { DataType, is } from './is.func'
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
 * Tests whether a number is multiple of another number.
 * Keep in mind that Infinity, positive or negative, would return
 * NaN when using it with the modulus operator.
 */
export function isMultipleOf(val: number | undefined, multipleOf: number | undefined): boolean {
  return (
    multipleOf === 0 ||
    (typeof val === 'number' &&
      /**
     * The modulus operator here excludes both infinities, i.e.,
     * isNaN(Infinity % 1) === true
     */
      !isNaN(val % 1) &&
      /**
     * `Math.abs` avoids `-0`
     * The non-null assertion below is okay because we're
     * strictly checking for the remainder to be zero
     */
      // tslint:disable-next-line no-non-null-assertion
      Math.abs(val % multipleOf!) === 0)
  )
}

/**
 * Tests a value within bounds of min, max, exclusive min and exclusive max
 */
export function testNumberWithinBounds(
  val: number,
  min: number | undefined,
  max: number | undefined,
  exclMin: number | undefined,
  exclMax: number | undefined
): boolean {
  return (
    (min !== undefined && val >= min) &&
    (max !== undefined && val <= max) &&
    (exclMin === NEG_INF || (exclMin !== undefined && val > exclMin)) &&
    (exclMax === POS_INF || (exclMax !== undefined && val < exclMax))
  )
}

/**
 * Tests whether a value is primitive or not
 */
export function isPrimitive(val: any): boolean {
  const t = typeof val
  return val === null || (t !== 'function' && t !== 'object')
}

/**
 * Tests an object against an object schema.
 */
export function matchesSchema(val: any, schema: isTypeSchema | isTypeSchema[]): boolean {
  const schemas = Array.isArray(schema) ? schema : [schema];

  /** Test every schema until at least one of them matches */
  return schemas.some((s: isTypeSchema) => {
    /** If type is defined but invalid, schema is false */
    if (s.type !== undefined && !validDataType(s.type)) return false

    /** Cache the type. Use `any` if none is present */
    const sType: DataType | DataType[] = s.type === undefined ? <DT>DATATYPE.any : s.type

    /** Test if any of the data types matches */
    const sTypeValid = isOneOfMultipleTypes(val, sType, s.options)

    /**
     * Whether the properties match what's reflected in the schema.
     * Initially assumed as `true`.
     */
    let sPropsValid = true

    /**
     * Whether the required properties are present.
     * Initially assumed as `true`.
     */
    let sRequiredValid = true

    /** Extract the properties to test for into an array */
    const sProps = s.props && typeof s.props === 'object' ? s.props : {};
    const sPropKeys: string[] = Object.keys(sProps)

    /** Begin tests relevant to properties */
    if (sPropKeys.length > 0) {
      /**
       * Get all keys that are required from the schema,
       * and then test for required properties.
       */
      sRequiredValid = sPropKeys
        .filter(p => sProps[p].required === true)
        .every(r => val[r] !== undefined)

      /**
       * Iterate over the property keys.
       *
       * If the subject has the property we're seeking,
       * `matchesSchema` is called on that property.
       *
       * If `p`, the property, is not an object, it won't be validated against.
       * However, if it was required, that will have been caught by the check above.
       */
      sPropsValid = sPropKeys.every(p =>
        !!s.props && val !== undefined && val[p] !== undefined
          ? matchesSchema(val[p], s.props[p])
          : true
      )
    }

    /** If `type` is Any, check whether value is array. If so, check items */
    const inferredArray = sType === <DT>DATATYPE.any && Array.isArray(val)

    /**
     * Whether Array items are valid
     * If we're dealing with an array, even if inferred, check the `items`. Otherwise, true.
     */
    const sItemsValid = (
      (sType === <DT>DATATYPE.array || inferredArray) && sTypeValid && s.items !== undefined
        ? (val as any[]).every(i => matchesSchema(i, s.items as isTypeSchema | isTypeSchema[]))
        : true
    );

    return sTypeValid && sRequiredValid && sPropsValid && sItemsValid
  })
}

/**
 * Tests a value against a series of DataTypes (one or more).
 */
export function isOneOfMultipleTypes(val: any, type: DataType | DataType[], options?: isOptions): boolean {
  /** Coerce `DataType` into an array and filter out non-`DataType` items */
  const types = (Array.isArray(type) ? type : [type]).filter(validDataType)

  /**
   * If no length, return false
   * Else if `types` contain any, return true
   * Else test against `is`
   */
  return types.length > 0 ? types.some(n => is(val, n, options)) : false
}

/**
 * Extends an object with the *enumerable* and *own* properties of one or more source objects,
 * similar to Object.assign.
 */
export function extendObject(dest: any, ...sources: any[]): any {
  /** Triple equals below is okay because we're also checking for undefined */
  // tslint:disable-next-line triple-equals
  if (dest == null) {
    throw TypeError('Cannot convert undefined or null to object')
  }

  for (const source of sources) {
    if (source !== null) {
      for (const key in source) {
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
 */
export function isValidOptions(options: isOptions | undefined): boolean {
  /** Ensure object */
  const op: isOptions = options !== undefined && is(options, <DT>DATATYPE.object) ? options : {}

  /**
   * Test every property.
   * If even a single option is wrong, no pass.
   */
  return Object.keys(op).every(o => {
    /** DataType case */
    if (o === 'type') {
      return validDataType(op[o])
    }

    /** string cases */
    if (o === 'pattern' || o === 'patternFlags') {
      return typeof op[o] === 'string'
    }

    /** Boolean cases */
    if (o === 'exclEmpty' || o === 'allowNull' || o === 'arrayAsObject') {
      return typeof op[o] === 'boolean'
    }

    /** Number cases */
    if (o === 'min' || o === 'max' || o === 'exclMin' || o === 'exclMax' || o === 'multipleOf') {
      /** The non-null assertion below is because TS is having trouble inferring type  */
      // tslint:disable-next-line no-non-null-assertion
      return typeof op[o] === 'number' && !isNaN(op[o]!)
    }

    /** Schema case */
    if (o === 'schema') {
      return (
        op[o] === null ||
        matchesSchema(op[o], {
          /** `isTypeSchema` is always an object */
          props: {
            items: {
              items: { type: <DT>DATATYPE.object },
              type: [<DT>DATATYPE.object, <DT>DATATYPE.array]
            },
            options: { type: <DT>DATATYPE.object },
            props: { type: <DT>DATATYPE.object },
            required: { type: <DT>DATATYPE.boolean },
            type: {
              items: { type: <DT>DATATYPE.number },
              type: [<DT>DATATYPE.number, <DT>DATATYPE.array]
            },
          },
          type: <DT>DATATYPE.object,
        })
      )
    }

    return true
  })
}

/**
 * Checks for whether an item is a valid option in the DataType enum
 */
export function validDataType(val: number | string | (number | string)[] | undefined): boolean {
  function check(val: number | string | undefined) {
    return typeof val === 'number' && val in DataType
  }

  return Array.isArray(val) ? val.every(check) : check(val)
}
