import { isOptions } from './interfaces'
import { DATATYPE, DT, validDataType } from './data-type'
import { matchesSchema } from './schema'

/**
 * Tests whether a value is primitive or not
 */
export function isPrimitive (val: any): boolean {
  const t = typeof val
  return val === null || (t !== 'function' && t !== 'object')
}

/**
 * Extends an object with the *enumerable* and *own* properties of one or more source objects,
 * similar to Object.assign.
 */
export function extendObject (dest: any, ...sources: any[]): any {
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
export function isValidOptions (options: isOptions | undefined): boolean {
  /** Ensure object */
  const op: isOptions = options !== undefined && (typeof options === 'object' && options !== null) ? options : {}

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
              items: { type: <DT> DATATYPE.object },
              type: [<DT> DATATYPE.object, <DT> DATATYPE.array]
            },
            options: { type: <DT> DATATYPE.object },
            props: { type: <DT> DATATYPE.object },
            required: { type: <DT> DATATYPE.boolean },
            type: {
              items: { type: <DT> DATATYPE.number },
              type: [<DT> DATATYPE.number, <DT> DATATYPE.array]
            }
          },
          type: <DT> DATATYPE.object
        })
      )
    }

    return true
  })
}
