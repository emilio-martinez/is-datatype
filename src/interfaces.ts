// tslint:disable no-use-before-declare

import { DataType } from './data-type'

/**
 * A descriptive model of what an object is expected to be.
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
 */
export type isOptions = Partial<StrictOptions>
export interface StrictOptions extends
  StrictOptionsNumber, StrictOptionsString, StrictOptionsArray, StrictOptionsObject {}

/**
 * The options available to use on a number type use case with `is`
 */
export type isOptionsNumber = Partial<StrictOptionsNumber>
export interface StrictOptionsNumber extends StrictOptionsMinMax {
  multipleOf: number
}

/**
 * The options available to use on a string type use case with `is`
 */
export type isOptionsString = Partial<StrictOptionsString>
export interface StrictOptionsString {
  pattern: string
  patternFlags: string
  exclEmpty: boolean
}

/**
 * The options available to use on an Array type use case with `is`
 */
export type isOptionsArray = Partial<StrictOptionsArray>
export interface StrictOptionsArray extends StrictOptionsMinMax, StrictOptionsSchema {
  type: DataType | DataType[]
}

/**
 * The options available to use on an Object type use case with `is`
 */
export type isOptionsObject = Partial<StrictOptionsObject>
export interface StrictOptionsObject extends StrictOptionsSchema {
  arrayAsObject: boolean
}

/**
 * A shared interface for those option sets that use the `schema` options
 */
export type isOptionsSchema = Partial<StrictOptionsSchema>
export interface StrictOptionsSchema {
  schema: isTypeSchema | isTypeSchema[] | null
}

/**
 * A shared interface for those option sets that use the `min` and `max` options
 */
export type isOptionsMinMax = Partial<StrictOptionsMinMax>
export interface StrictOptionsMinMax {
  min: number
  max: number
  exclMin: number
  exclMax: number
}
