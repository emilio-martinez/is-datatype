/**
 * Tests whether a number is multiple of another number.
 * Keep in mind that Infinity, positive or negative, would return
 * NaN when using it with the modulus operator.
 */
export function isMultipleOf(val: number | undefined, multipleOf: number | undefined): boolean {
  return (
    // First, Check that val is a number
    typeof val === 'number' &&
    // A few things going on here:
    // * OK if multipleOf is 0; all numbers are multiples of zero, i.e., x * 0 === 0
    // * isNaN check uses modulus operator to exclude infinities, i.e., isNaN(Infinity % 1) === true
    // * Math.abs` avoids `-0`
    // tslint:disable-next-line no-non-null-assertion
    (multipleOf === 0 || (!isNaN(val % 1) && Math.abs(val % multipleOf!) === 0))
  );
}

/**
 * Tests a value within bounds of min, max, exclusive min and exclusive max
 */
export function testNumberWithinBounds(
  val: number,
  min: number | undefined,
  max: number | undefined
): boolean {
  return min !== undefined && val >= min && (max !== undefined && val <= max);
}
