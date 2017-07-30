import { DataType } from './is.func'

/**
 * A descriptive model of what an object is expected to be.
 * @export
 * @interface isTypeSchema
 */
export interface isTypeSchema {
  type?: DataType | DataType[]
  props?: { [k: string]: isTypeSchema }
  items?: isTypeSchema | isTypeSchema[]
  required?: boolean
  options?: isOptions
}

/**
 * The entirety of the options available to use with `is`
 * @export
 * @interface isOptions
 * @extends {isOptionsNumber}
 * @extends {isOptionsString}
 * @extends {isOptionsArray}
 * @extends {isOptionsObject}
 */
export interface isOptions extends isOptionsNumber, isOptionsString, isOptionsArray, isOptionsObject {}

/**
 * The options available to use on a number type use case with `is`
 * @export
 * @interface isOptionsNumber
 * @extends {isOptionsMinMax}
 */
export interface isOptionsNumber extends isOptionsMinMax {
  multipleOf?: number
}

/**
 * The options available to use on a string type use case with `is`
 * @export
 * @interface isOptionsString
 */
export interface isOptionsString {
  pattern?: string
  patternFlags?: string
  exclEmpty?: boolean
}

/**
 * The options available to use on an Array type use case with `is`
 * @export
 * @interface isOptionsArray
 * @extends {isOptionsMinMax}
 * @extends {isOptionsSchema}
 */
export interface isOptionsArray extends isOptionsMinMax, isOptionsSchema {
  type?: DataType | DataType[]
}

/**
 * The options available to use on an Object type use case with `is`
 * @export
 * @interface isOptionsObject
 * @extends {isOptionsSchema}
 */
export interface isOptionsObject extends isOptionsSchema {
  allowNull?: boolean
  arrayAsObject?: boolean
}

/**
 * A shared interface for those option sets that use the `schema` options
 * @export
 * @interface isOptionsSchema
 */
export interface isOptionsSchema {
  schema?: isTypeSchema | isTypeSchema[] | null
}

/**
 * A shared interface for those option sets that use the `min` and `max` options
 * @export
 * @interface isOptionsMinMax
 */
export interface isOptionsMinMax {
  min?: number
  max?: number
  exclMin?: number
  exclMax?: number
}
