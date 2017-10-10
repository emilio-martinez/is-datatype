/* eslint-env jasmine */

import { DataType } from '../is.func'
import { isOneOfMultipleTypes } from '../is.internal'
import { getDataTypeUseCases } from './test-cases/test-cases.spec'

const invalidTypeValues = [
  1000, // The DataType enum is an object with has numbers, but they don't come even close to 1000
  [1000],
  'hello',
  ['hello'],
  {},
  function () {},
  null,
  undefined
]

describe(`isOneOfMultipleTypes`, () => {
  it(`should only take valid \`DataType\` values for the \`type\` argument`, () => {
    invalidTypeValues.forEach(n =>
      expect(isOneOfMultipleTypes(true, n as DataType)).toBe(false, `Failed test for ${JSON.stringify(n)}`)
    )
  })

  it(`should immediately return \`true\` when \`any\` is passed`, () => {
    getDataTypeUseCases().forEach(n => {
      expect(isOneOfMultipleTypes(n, DataType.any)).toBe(true, `Failed for \`${n}\` of type \`${typeof n}\``)
      expect(isOneOfMultipleTypes(n, [DataType.any])).toBe(true, `Failed for \`${n}\` of type \`${typeof n}\``)
    })
  })

  it(`should test multiple \`DataType\` in addition to a single one`, () => {
    const testCases: {
      test: any
      type: DataType | DataType[]
      expect: boolean
    }[] = [
      { test: [10, 'a'], type: [DataType.number, DataType.string], expect: true },
      { test: [10], type: DataType.number, expect: true },
      { test: [10], type: DataType.string, expect: false },
      { test: ['a'], type: DataType.number, expect: false },
      { test: ['a'], type: DataType.string, expect: true },
      { test: [10, 'a'], type: [DataType.undefined, DataType.function], expect: false }
    ]

    testCases.forEach(n =>
      n.test.forEach(m =>
        expect(isOneOfMultipleTypes(m, n.type)).toBe(
          n.expect,
          `Failed for ${m} when \`type\` is ${JSON.stringify(n.type)}`
        )
      )
    )
  })
})
