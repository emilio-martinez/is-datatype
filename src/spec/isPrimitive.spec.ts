import { isPrimitive } from '../is.internal'
import { getDataTypeUseCases } from './test-cases/test-cases.spec'
import { DataType } from '../is.func'

describe('`isPrimitive` function', () => {
  /**
   * The below tests are working under the operating assumption that DataType
   * has been organized to have all primitives to have indexes under 10
   * and all non-primitives to have indexes over 10.
   */
  const PRIMITIVE_CUTOFF = 10
  const DataTypeKeys = Object.keys(DataType)
    .map(k => parseInt(k, 10))
    .filter(k => typeof k == 'number')
  const nonPrimitiveKeys = DataTypeKeys.filter(i => i > PRIMITIVE_CUTOFF)
  const primitiveKeys = DataTypeKeys.filter(i => i < PRIMITIVE_CUTOFF)

  it('should return true when primitive value', function() {
    /** We exclude the non-primitive keys, so only primitives should remain */
    getDataTypeUseCases(nonPrimitiveKeys).forEach(n =>
      expect(isPrimitive(n)).toBeTruthy(
        `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for a primitive value`
      )
    )
  })

  it('should return false when not primitive value', function() {
    /** We exclude the primitive keys, so only non-primitives should remain */
    getDataTypeUseCases(primitiveKeys).forEach(n =>
      expect(isPrimitive(n)).toBeFalsy(
        `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for a non-primitive value`
      )
    )
  })
})
