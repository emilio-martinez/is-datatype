import { isPrimitive } from '../is.internal'
import * as TC from './test-cases/test-cases.spec'

describe('`isPrimitive` function', () => {
  /**
   * The below tests are working under the operating assumption that DataType
   * has been organized to have all primitives to have indexes under 10
   * and all non-primitives to have indexes over 10.
   */
  const cutoff = 10

  it('should return true when primitive value', function() {
    TC.aggregateUseCases
      .filter((n, i) => i < cutoff)
      .forEach(n =>
        n.forEach(m =>
          expect(isPrimitive(m)).toBeTruthy(
            `Failed for \`${m}\` of type \`${typeof m}\` passed when validating for a primitive value`
          )
        )
      )
  })

  it('should return false when not primitive value', function() {
    TC.aggregateUseCases
      .filter((n, i) => i > cutoff)
      .forEach(n =>
        n.forEach(m =>
          expect(isPrimitive(m)).toBeFalsy(
            `Failed for \`${m}\` of type \`${typeof m}\` passed when validating for a non-primitive value`
          )
        )
      )
  })
})
