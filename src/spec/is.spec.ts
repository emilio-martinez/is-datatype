import { is, DataType, isOptions } from '../is.func'
import { matchesSchema } from '../is.internal'
import {
  validNumberUseCases,
  validNumberNegativeUseCases,
  invalidNumberUseCases,
  numberRangeUseCases,
  multipleOfUseCases,
  getDataTypeUseCases,
  integerUseCases,
  naturalUseCases,
  validStringUseCases,
  stringPatternUseCases,
  validBooleanUseCases,
  validArrayUseCases,
  arrayWithOptionsUseCases,
  arraySchemaUseCases,
  validFunctionUseCases,
  validObjectUseCases,
  optionalObjectUseCases,
  objectSchemaUseCases,
  validUndefinedUseCases
} from './test-cases/test-cases.spec'

describe('`is` and `matchesSchema`', () => {
  describe('should validate for invalid `type` arguments', () => {
    it('when an out of range number is provided', () => {
      expect(() => is(false, -2)).toThrow()
      expect(matchesSchema(false, { type: -2 })).toBe(false)
      expect(() => is(false, 0)).toThrow()
      expect(matchesSchema(false, { type: 0 })).toBe(false)
      expect(() => is(false, 1)).not.toThrow()
      expect(matchesSchema(false, { type: 1 })).toBe(false)
    })

    it('when one of the "named" DataType keys is provided, regardless of technically being a valid DataType key', () => {
      expect(() => is(false, DataType[1] as any)).toThrow()
      expect(matchesSchema(false, { type: DataType[1] as any })).toBe(false)
    })

    it('when undefined is passed', () => {
      expect(() => is(false, undefined)).toThrow()
      /** NOTE: `matchesSchema` here would ignore the `type` because it's optional */
    })
  })

  describe('for `number` types', () => {
    const currentDataType = DataType.number

    it('should work in regular use cases', () => {
      validNumberUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` use case ${n}`
        )
      )
      validNumberNegativeUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid negative \`${DataType[currentDataType]}\` use case ${n}`
        )
      )
      invalidNumberUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          `Failed for invalid \`${DataType[currentDataType]}\` use case ${n}`
        )
      )
    })

    it('should work in optional use cases', () => {
      numberRangeUseCases.forEach(n =>
        expect(
          is(n.test, currentDataType, n.options) && matchesSchema(n.test, { type: currentDataType, options: n.options })
        ).toBe(
          n.expect,
          `Failed for \`${DataType[currentDataType]}\` range options use case ${n.test} with options ${JSON.stringify(
            n.options
          )}`
        )
      )
      multipleOfUseCases.forEach(n =>
        expect(
          is(n.test, currentDataType, n.options) && matchesSchema(n.test, { type: currentDataType, options: n.options })
        ).toBe(
          n.expect,
          `Failed for \`${DataType[
            currentDataType
          ]}\` \`multipleOf\` options use case ${n.test} with options ${JSON.stringify(n.options)}`
        )
      )
    })

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for \`${DataType[currentDataType]}\``
        )
      )
    })

    describe('particular use cases', () => {
      it('should work for `integer` use cases', () => {
        const currentDataType = DataType.integer

        integerUseCases.forEach(n =>
          expect(
            is(n.test, currentDataType, n.options) &&
              matchesSchema(n.test, { type: currentDataType, options: n.options })
          ).toBe(
            n.expect,
            `Failed for \`${DataType[currentDataType]}\` use case ${n.test} with options ${JSON.stringify(n.options)}`
          )
        )
      })

      it('should work for `natural` use cases', () => {
        const currentDataType = DataType.natural

        naturalUseCases.forEach(n =>
          expect(
            is(n.test, currentDataType, n.options) &&
              matchesSchema(n.test, { type: currentDataType, options: n.options })
          ).toBe(
            n.expect,
            `Failed for \`${DataType[currentDataType]}\` use case ${n.test} with options ${JSON.stringify(n.options)}`
          )
        )
      })
    })
  })

  describe('for `string` types', () => {
    const currentDataType = DataType.string

    it('should work for regular use cases', () => {
      validStringUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test ${n}`
        )
      )
      expect(is('', currentDataType)).toBe(
        true,
        `Failed for valid \`${DataType[currentDataType]}\` test on an empty string`
      )
    })

    it('should work in optional use cases', () => {
      validStringUseCases.forEach(n =>
        expect(
          is(n, currentDataType, { exclEmpty: true }) &&
            matchesSchema(n, { type: currentDataType, options: { exclEmpty: true } })
        ).toBe(true, `Failed for valid \`${DataType[currentDataType]}\` test with options ${n}`)
      )
      expect(
        is('', currentDataType, { exclEmpty: true }) &&
          matchesSchema('', { type: currentDataType, options: { exclEmpty: true } })
      ).toBe(false, `Failed for valid \`${DataType[currentDataType]}\` test with options on an empty string`)
      stringPatternUseCases.forEach(n =>
        expect(
          is(n.test, currentDataType, n.options) && matchesSchema(n.test, { type: currentDataType, options: n.options })
        ).toBe(
          n.expect,
          `Failed for \`${DataType[currentDataType]}\` pattern use case ${n.test} with options ${JSON.stringify(
            n.options
          )}`
        )
      )
    })

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for \`${DataType[currentDataType]}\``
        )
      )
    })
  })

  describe('for `boolean` types', () => {
    const currentDataType = DataType.boolean

    it('should work for regular use cases', () => {
      validBooleanUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test ${n}`
        )
      )
    })

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for \`${DataType[currentDataType]}\``
        )
      )
    })
  })

  describe('for `array` types', () => {
    const currentDataType = DataType.array

    it('should work for regular use cases', () => {
      validArrayUseCases.forEach(n =>
        expect(is(n.test, currentDataType) && matchesSchema(n.test, { type: currentDataType })).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test ${n.test}`
        )
      )
    })

    it('should work in optional use cases', () => {
      validArrayUseCases.forEach(n =>
        expect(
          is(n.test, currentDataType, n.options) && matchesSchema(n.test, { type: currentDataType, options: n.options })
        ).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test ${n.test} with options ${JSON.stringify(n.options)}`
        )
      )
      arrayWithOptionsUseCases.forEach(n =>
        expect(
          is(n.test, currentDataType, n.options) && matchesSchema(n.test, { type: currentDataType, options: n.options })
        ).toBe(
          n.expect,
          `Failed for invalid \`${DataType[currentDataType]}\` test ${n.test} with options ${JSON.stringify(
            n.options
          )}. ${n['describe'] ? n['describe'] : ''}`
        )
      )
    })

    it('should work in optional schema use cases', () => {
      arraySchemaUseCases.forEach((n, i) =>
        expect(
          is(n.test, currentDataType, n.options) && matchesSchema(n.test, { type: currentDataType, options: n.options })
        ).toBe(
          n.expect,
          `Failed for valid \`${DataType[currentDataType]}\` test ${JSON.stringify(
            n.test
          )} with options (${i}) ${JSON.stringify(n.options)}: ${n.description}`
        )
      )
    })

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for \`${DataType[currentDataType]}\``
        )
      )
    })
  })

  describe('for `function` types', () => {
    const currentDataType = DataType.function

    it('should work for regular use cases', () => {
      validFunctionUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test ${n}`
        )
      )
    })

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for \`${DataType[currentDataType]}\``
        )
      )
    })
  })

  describe('for `object` types', () => {
    const currentDataType = DataType.object

    it('should work for regular use cases', () => {
      validObjectUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test ${n}`
        )
      )
      optionalObjectUseCases.forEach(n =>
        expect(is(n.test, currentDataType)).toBe(false, `Failed for invalid \`${DataType[currentDataType]}\` test ${n}`)
      )
    })

    it('should work in optional use cases', () => {
      optionalObjectUseCases.forEach(n =>
        expect(
          is(n.test, currentDataType, n.options) && matchesSchema(n.test, { type: currentDataType, options: n.options })
        ).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test ${n.test} with options ${JSON.stringify(n.options)}`
        )
      )
    })

    it('should work in optional schema use cases', () => {
      objectSchemaUseCases.forEach(n =>
        expect(
          is(n.test, currentDataType, n.options) && matchesSchema(n.test, { type: currentDataType, options: n.options })
        ).toBe(
          n.expect,
          `Failed for valid \`${DataType[currentDataType]}\` test ${JSON.stringify(
            n.test
          )} with options ${JSON.stringify(n.options)}: ${n.description}`
        )
      )
    })

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for \`${DataType[currentDataType]}\``
        )
      )
    })
  })

  describe('for `undefined` types', () => {
    const currentDataType = DataType.undefined

    it('should work for regular use cases', () => {
      validUndefinedUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test ${n}`
        )
      )
    })

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for \`${DataType[currentDataType]}\``
        )
      )
    })
  })

  describe('for `any` types', () => {
    const currentDataType = DataType.any

    it('should work for regular use cases', () => {
      getDataTypeUseCases(currentDataType).forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for \`${DataType[currentDataType]}\``
        )
      )
      expect(is(null, currentDataType)).toBe(false, `Failed for valid \`${DataType[currentDataType]}\` test null`)
    })

    it('should work in optional use cases', () => {
      expect(
        is(null, currentDataType, { allowNull: true }) &&
          matchesSchema(null, { type: currentDataType, options: { allowNull: true } })
      ).toBe(true, `Failed for valid \`${DataType[currentDataType]}\` test null`)
    })
  })

  describe('`options` validation', () => {
    it('should detect invalid values assigned to `type`', () => {
      expect(() => is([''], DataType.array, { type: DataType.string })).not.toThrow()
      expect(() => is([''], DataType.array, { type: DataType[DataType.string] } as any)).toThrow()
    })

    it('should detect invalid values assigned to `pattern`', () => {
      expect(() => is('hello', DataType.string, { pattern: 'hello' })).not.toThrow()
      expect(() => is('hello', DataType.string, { pattern: /(hello)/ } as any)).toThrow()
    })

    it('should detect invalid values assigned to `patternFlags`', () => {
      expect(() => is('hello', DataType.string, { patternFlags: '' })).not.toThrow()
      expect(() => is('hello', DataType.string, { patternFlags: 'ig' })).not.toThrow()
      expect(() => is('hello', DataType.string, { patternFlags: null } as any)).toThrow()
    })

    it('should detect invalid values assigned to `exclEmpty`', () => {
      expect(() => is('hello', DataType.string, { exclEmpty: true })).not.toThrow()
      expect(() => is('hello', DataType.string, { exclEmpty: 'true' } as any)).toThrow()
      expect(() => is('hello', DataType.string, { exclEmpty: 1 } as any)).toThrow()
    })

    it('should detect invalid values assigned to `schema`', () => {
      expect(() => is({}, DataType.object, { schema: null })).not.toThrow()
      expect(() => is({}, DataType.object, { schema: {} })).not.toThrow()
      expect(() => is({}, DataType.object, { schema: undefined } as any)).toThrow()
    })

    it('should detect invalid values assigned to `allowNull`', () => {
      expect(() => is(null, DataType.object, { allowNull: true })).not.toThrow()
      expect(() => is(null, DataType.object, { allowNull: 'true' } as any)).toThrow()
      expect(() => is(null, DataType.object, { allowNull: 1 } as any)).toThrow()
    })

    it('should detect invalid values assigned to `arrayAsObject`', () => {
      expect(() => is([''], DataType.object, { arrayAsObject: true })).not.toThrow()
      expect(() => is([''], DataType.object, { arrayAsObject: 'true' } as any)).toThrow()
      expect(() => is([''], DataType.object, { arrayAsObject: 1 } as any)).toThrow()
    })

    it('should detect invalid values assigned to `min`', () => {
      expect(() => is(100, DataType.number, { min: 0 })).not.toThrow()
      expect(() => is(100, DataType.number, { min: '0' } as any)).toThrow()
      expect(() => is(100, DataType.number, { min: NaN })).toThrow()
    })

    it('should detect invalid values assigned to `max`', () => {
      expect(() => is(100, DataType.number, { max: 0 })).not.toThrow()
      expect(() => is(100, DataType.number, { max: '0' } as any)).toThrow()
      expect(() => is(100, DataType.number, { max: NaN })).toThrow()
    })

    it('should detect invalid values assigned to `exclMin`', () => {
      expect(() => is(100, DataType.number, { exclMin: 0 })).not.toThrow()
      expect(() => is(100, DataType.number, { exclMin: '0' } as any)).toThrow()
      expect(() => is(100, DataType.number, { exclMin: NaN })).toThrow()
    })

    it('should detect invalid values assigned to `exclMax`', () => {
      expect(() => is(100, DataType.number, { exclMax: 0 })).not.toThrow()
      expect(() => is(100, DataType.number, { exclMax: '0' } as any)).toThrow()
      expect(() => is(100, DataType.number, { exclMax: NaN })).toThrow()
    })

    it('should detect invalid values assigned to `multipleOf`', () => {
      expect(() => is(100, DataType.number, { multipleOf: 0 })).not.toThrow()
      expect(() => is(100, DataType.number, { multipleOf: '0' } as any)).toThrow()
      expect(() => is(100, DataType.number, { multipleOf: NaN })).toThrow()
    })

    it('should not fail when passed unexpected values', () => {
      expect(() => is(100, DataType.number, {})).not.toThrow()
      expect(() => is(100, DataType.number, null)).not.toThrow()
      expect(() => is(100, DataType.number, undefined)).not.toThrow()
      expect(() => is(100, DataType.number, NaN as any)).not.toThrow()
      expect(() => is(100, DataType.number, 'hello' as any)).not.toThrow()
      expect(() => is(100, DataType.number, Number.NEGATIVE_INFINITY as any)).not.toThrow()
      expect(() => is(100, DataType.number, new Date() as any)).not.toThrow()
    })
  })
})

// Symbols
// typeof Symbol() === 'symbol'
// typeof Symbol('foo') === 'symbol'
// typeof Symbol.iterator === 'symbol'
