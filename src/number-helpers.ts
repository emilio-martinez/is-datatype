import { NEGATIVE_INFINITY, POSITIVE_INFINITY } from './constants'

/**
 * Tests whether a number is multiple of another number.
 * Keep in mind that Infinity, positive or negative, would return
 * NaN when using it with the modulus operator.
 */
export function isMultipleOf (val: number | undefined, multipleOf: number | undefined): boolean {
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
export function testNumberWithinBounds (
  val: number,
  min: number | undefined,
  max: number | undefined,
  exclMin: number | undefined,
  exclMax: number | undefined
): boolean {
  return (
    (min !== undefined && val >= min) &&
    (max !== undefined && val <= max) &&
    (exclMin === NEGATIVE_INFINITY || (exclMin !== undefined && val > exclMin)) &&
    (exclMax === POSITIVE_INFINITY || (exclMax !== undefined && val < exclMax))
  )
}
