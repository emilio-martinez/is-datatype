/**
 * Tests whether a value is primitive or not
 */
export function isPrimitive (val: any): boolean {
  const t = typeof val
  return val === null || (t !== 'function' && t !== 'object')
}
