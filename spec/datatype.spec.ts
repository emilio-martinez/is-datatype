/* eslint-env jasmine */

import { DataType, DATATYPE } from '../src/data-type'
import { dataTypeKeys } from './test-cases/test-cases.spec'

describe('`DataType` parity', () => {
  it(`should have the same values`, () => {
    const testedTypes = []

    expect(DataType.any).toBe(DATATYPE.any as number, 'Failed for `any`')
    testedTypes.push(DataType.any)
    expect(DataType.undefined).toBe(DATATYPE.undefined as number, 'Failed for `undefined`')
    testedTypes.push(DataType.undefined)
    expect(DataType.boolean).toBe(DATATYPE.boolean as number, 'Failed for `boolean`')
    testedTypes.push(DataType.boolean)
    expect(DataType.number).toBe(DATATYPE.number as number, 'Failed for `number`')
    testedTypes.push(DataType.number)
    expect(DataType.integer).toBe(DATATYPE.integer as number, 'Failed for `integer`')
    testedTypes.push(DataType.integer)
    expect(DataType.natural).toBe(DATATYPE.natural as number, 'Failed for `natural`')
    testedTypes.push(DataType.natural)
    expect(DataType.string).toBe(DATATYPE.string as number, 'Failed for `string`')
    testedTypes.push(DataType.string)
    expect(DataType.function).toBe(DATATYPE.function as number, 'Failed for `function`')
    testedTypes.push(DataType.function)
    expect(DataType.object).toBe(DATATYPE.object as number, 'Failed for `object`')
    testedTypes.push(DataType.object)
    expect(DataType.array).toBe(DATATYPE.array as number, 'Failed for `array`')
    testedTypes.push(DataType.array)

    /** This test should validate that all types have been accounted for */
    expect(Object.keys(DataType).length / 2)
      .toBe(dataTypeKeys.length, '`dataTypeKeys` has an incorrect length')
    expect(dataTypeKeys.every(k => testedTypes.indexOf(k) >= 0))
      .toBeTruthy(`There's a type that hasn't been accounted for.`)
  })
})
