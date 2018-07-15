import { is } from '../src/is';
import { DataType } from '../src/data-type';
import { matchesSchema } from '../src/schema';
import {
  arraySchemaUseCases,
  arrayWithOptionsUseCases,
  getDataTypeUseCases,
  integerUseCases,
  invalidNumberUseCases,
  multipleOfUseCases,
  naturalUseCases,
  numberRangeUseCases,
  objectSchemaUseCases,
  optionalObjectUseCases,
  stringPatternUseCases,
  validArrayUseCases,
  validBooleanUseCases,
  validFunctionUseCases,
  validNullUseCases,
  validNumberNegativeUseCases,
  validNumberUseCases,
  validObjectUseCases,
  validStringUseCases,
  validUndefinedUseCases
} from './test-cases/test-cases.spec';

describe('`is` and `matchesSchema`', () => {
  describe('should validate for invalid `type` arguments', () => {
    it('when an out of range number is provided', () => {
      expect(() => is(false, -2)).toThrow();
      expect(matchesSchema(false, { type: -2 })).toBe(false, 'Failed for -2');
      expect(() => is(false, 0)).toThrow();
      expect(matchesSchema(false, { type: 0 })).toBe(false, 'Failed for 0');
      expect(() => is(false, 1)).not.toThrow();
      expect(matchesSchema(false, { type: 1 })).toBe(false, 'Failed for 1');
    });

    it('when a "named" DataType key is provided', () => {
      expect(() => is(false, DataType[1] as any)).toThrow();
      expect(matchesSchema(false, { type: DataType[1] as any })).toBe(false);
    });

    it('when undefined is passed', () => {
      expect(() => is(false, undefined as any)).toThrow();
      /** NOTE: `matchesSchema` here would ignore the `type` because it's optional */
    });
  });

  describe('for `number` types', () => {
    const currentDataType = DataType.number;

    it('should work in regular use cases', () => {
      validNumberUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` use case ${n}`
        )
      );
      validNumberNegativeUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid negative \`${DataType[currentDataType]}\` use case ${n}`
        )
      );
      invalidNumberUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          `Failed for invalid \`${DataType[currentDataType]}\` use case ${n}`
        )
      );
    });

    it('should work in optional use cases', () => {
      numberRangeUseCases.forEach(n => {
        const test =
          is(n.test, currentDataType, n.options) &&
          matchesSchema(n.test, { type: currentDataType, options: n.options });
        const errType = DataType[currentDataType];
        const errOptions = JSON.stringify(n.options);
        const errMessage =
          `Failed for \`${errType}\` range options use case ${n.test} ` +
          `with options ${errOptions}`;
        expect(test).toBe(n.expect, errMessage);
      });
      multipleOfUseCases.forEach(n => {
        const test =
          is(n.test, currentDataType, n.options) &&
          matchesSchema(n.test, { type: currentDataType, options: n.options });
        const errType = DataType[currentDataType];
        const errOptions = JSON.stringify(n.options);
        const errMessage =
          `Failed for \`${errType}\` \`multipleOf\` options use case ${n.test} ` +
          `with options ${errOptions}`;
        expect(test).toBe(n.expect, errMessage);
      });
    });

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n => {
        const test = is(n, currentDataType) && matchesSchema(n, { type: currentDataType });
        const errType = DataType[currentDataType];
        const errMessage =
          `Failed for \`${n}\` of type \`${typeof n}\` ` +
          ` passed when validating for \`${errType}\``;
        expect(test).toBe(false, errMessage);
      });
    });

    describe('particular use cases', () => {
      it('should work for `integer` use cases', () => {
        const currentDataType = DataType.integer;

        integerUseCases.forEach(n => {
          const test =
            is(n.test, currentDataType, n.options) &&
            matchesSchema(n.test, { type: currentDataType, options: n.options });
          const errType = DataType[currentDataType];
          const errOptions = JSON.stringify(n.options);
          const errMessage =
            `Failed for \`${errType}\` use case ${n.test} ` + `with options ${errOptions}`;
          expect(test).toBe(n.expect, errMessage);
        });
      });

      it('should work for `natural` use cases', () => {
        const currentDataType = DataType.natural;

        naturalUseCases.forEach(n => {
          const test =
            is(n.test, currentDataType, n.options) &&
            matchesSchema(n.test, { type: currentDataType, options: n.options });
          const errType = DataType[currentDataType];
          const errOptions = JSON.stringify(n.options);
          const errMessage =
            `Failed for \`${errType}\` use case ${n.test}` + `with options ${errOptions}`;
          expect(test).toBe(n.expect, errMessage);
        });
      });
    });
  });

  describe('for `string` types', () => {
    const currentDataType = DataType.string;
    const errType = DataType[currentDataType];

    it('should work for regular use cases', () => {
      validStringUseCases.forEach(n => {
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test ${n}`
        );
      });
      expect(is('', currentDataType)).toBe(
        true,
        `Failed for valid \`${DataType[currentDataType]}\` test on an empty string`
      );
    });

    it('should work in optional use cases', () => {
      validStringUseCases.forEach(n => {
        const test =
          is(n, currentDataType, { exclEmpty: true }) &&
          matchesSchema(n, { type: currentDataType, options: { exclEmpty: true } });
        expect(test).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test with options ${n}`
        );
      });

      const emptyStringTest =
        is('', currentDataType, { exclEmpty: true }) &&
        matchesSchema('', { type: currentDataType, options: { exclEmpty: true } });
      expect(emptyStringTest).toBe(
        false,
        `Failed for valid \`${DataType[currentDataType]}\` test with options on an empty string`
      );

      stringPatternUseCases.forEach(n => {
        const test =
          is(n.test, currentDataType, n.options) &&
          matchesSchema(n.test, { type: currentDataType, options: n.options });

        const errOptions = JSON.stringify(n.options);
        const errMessage =
          `Failed for \`${errType}\` pattern use case ${n.test} ` + `with options ${errOptions}`;
        expect(test).toBe(n.expect, errMessage);
      });
    });

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n => {
        const test = is(n, currentDataType) && matchesSchema(n, { type: currentDataType });
        const errMessage =
          `Failed for \`${n}\` of type \`${typeof n}\` ` +
          ` passed when validating for \`${errType}\``;
        expect(test).toBe(false, errMessage);
      });
    });
  });

  describe('for `boolean` types', () => {
    const currentDataType = DataType.boolean;
    const errType = DataType[currentDataType];

    it('should work for regular use cases', () => {
      validBooleanUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test ${n}`
        )
      );
    });

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n => {
        const errMessage =
          `Failed for \`${n}\` of type \`${typeof n}\` ` +
          `passed when validating for \`${errType}\``;
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          errMessage
        );
      });
    });
  });

  describe('for `array` types', () => {
    const currentDataType = DataType.array;
    const errType = DataType[currentDataType];

    it('should work for regular use cases', () => {
      validArrayUseCases.forEach(n =>
        expect(
          is(n.test, currentDataType) && matchesSchema(n.test, { type: currentDataType })
        ).toBe(true, `Failed for valid \`${DataType[currentDataType]}\` test ${n.test}`)
      );
    });

    it('should work in optional use cases', () => {
      validArrayUseCases.forEach(n => {
        const test =
          is(n.test, currentDataType, n.options) &&
          matchesSchema(n.test, { type: currentDataType, options: n.options });
        const errOptions = JSON.stringify(n.options);
        const errMessage =
          `Failed for valid \`${errType}\` test ${n.test}` + `with options ${errOptions}`;
        expect(test).toBe(true, errMessage);
      });
      arrayWithOptionsUseCases.forEach(n => {
        const test =
          is(n.test, currentDataType, n.options) &&
          matchesSchema(n.test, { type: currentDataType, options: n.options });
        const errOptions = JSON.stringify(n.options);
        const errMessage =
          `Failed for invalid \`${errType}\` test ${n.test}` + `with options ${errOptions}.`;
        expect(test).toBe(n.expect, errMessage);
      });
    });

    it('should work in optional schema use cases', () => {
      arraySchemaUseCases.forEach((n, i) => {
        const test =
          is(n.test, currentDataType, n.options) &&
          matchesSchema(n.test, { type: currentDataType, options: n.options });
        const errTest = JSON.stringify(n.test);
        const errOptions = JSON.stringify(n.options);
        const errMessage =
          `Failed for valid \`${errType}\` test ${errTest} ` +
          `with options (${i}) ${errOptions}: ${n.description}`;
        expect(test).toBe(n.expect, errMessage);
      });
    });

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for \`${errType}\``
        )
      );
    });
  });

  describe('for `function` types', () => {
    const currentDataType = DataType.function;
    const errType = DataType[currentDataType];

    it('should work for regular use cases', () => {
      validFunctionUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test ${n}`
        )
      );
    });

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n => {
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for \`${errType}\``
        );
      });
    });
  });

  describe('for `object` types', () => {
    const currentDataType = DataType.object;
    const errType = DataType[currentDataType];

    it('should work for regular use cases', () => {
      validObjectUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test ${n}`
        )
      );
      optionalObjectUseCases.forEach(n =>
        expect(is(n.test, currentDataType)).toBe(
          false,
          `Failed for invalid \`${DataType[currentDataType]}\` test ${n}`
        )
      );
    });

    it('should work in optional use cases', () => {
      optionalObjectUseCases.forEach(n => {
        const test =
          is(n.test, currentDataType, n.options) &&
          matchesSchema(n.test, { type: currentDataType, options: n.options });
        const errOptions = JSON.stringify(n.options);
        expect(test).toBe(
          true,
          `Failed for valid \`${errType}\` test ${n.test} with options ${errOptions}`
        );
      });
    });

    it('should work in optional schema use cases', () => {
      objectSchemaUseCases.forEach(n => {
        const test =
          is(n.test, currentDataType, n.options) &&
          matchesSchema(n.test, { type: currentDataType, options: n.options });
        const errTest = JSON.stringify(n.test);
        const errOptions = JSON.stringify(n.options);
        const errMessage =
          `Failed for valid \`${errType}\` test ${errTest} ` +
          `with options ${errOptions}: ${n.description}`;
        expect(test).toBe(n.expect, errMessage);
      });
    });

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for \`${errType}\``
        )
      );
    });
  });

  describe('for `undefined` types', () => {
    const currentDataType = DataType.undefined;
    const errType = DataType[currentDataType];

    it('should work for regular use cases', () => {
      validUndefinedUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test ${n}`
        )
      );
    });

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for \`${errType}\``
        )
      );
    });
  });

  describe('for `null` types', () => {
    const currentDataType = DataType.null;
    const errType = DataType[currentDataType];

    it('should work for regular use cases', () => {
      validNullUseCases.forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for valid \`${DataType[currentDataType]}\` test ${n}`
        )
      );
    });

    it('should work when passed other data types', () => {
      getDataTypeUseCases(currentDataType).forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          false,
          `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for \`${errType}\``
        )
      );
    });
  });

  describe('for `any` types', () => {
    const currentDataType = DataType.any;
    const errType = DataType[currentDataType];

    it('should work for regular use cases', () => {
      getDataTypeUseCases(currentDataType).forEach(n =>
        expect(is(n, currentDataType) && matchesSchema(n, { type: currentDataType })).toBe(
          true,
          `Failed for \`${n}\` of type \`${typeof n}\` passed when validating for \`${errType}\``
        )
      );
      expect(is(null, currentDataType)).toBe(
        true,
        `Failed for valid \`${DataType[currentDataType]}\` test null`
      );
    });
  });

  describe('`options` validation', () => {
    it('should detect invalid values assigned to `type`', () => {
      expect(() => is([''], DataType.array, { type: undefined })).not.toThrow();
      expect(() => is([''], DataType.array, { type: DataType.string })).not.toThrow();
      expect(() => is([''], DataType.array, { type: DataType[DataType.string] } as any)).toThrow();
    });

    it('should detect invalid values assigned to `pattern`', () => {
      expect(() => is('hello', DataType.string, { pattern: undefined })).not.toThrow();
      expect(() => is('hello', DataType.string, { pattern: 'hello' })).not.toThrow();
      expect(() => is('hello', DataType.string, { pattern: /(hello)/ } as any)).toThrow();
    });

    it('should detect invalid values assigned to `patternFlags`', () => {
      expect(() => is('hello', DataType.string, { patternFlags: undefined })).not.toThrow();
      expect(() => is('hello', DataType.string, { patternFlags: '' })).not.toThrow();
      expect(() => is('hello', DataType.string, { patternFlags: 'ig' })).not.toThrow();
      expect(() => is('hello', DataType.string, { patternFlags: null } as any)).toThrow();
    });

    it('should detect invalid values assigned to `exclEmpty`', () => {
      expect(() => is('hello', DataType.string, { exclEmpty: undefined })).not.toThrow();
      expect(() => is('hello', DataType.string, { exclEmpty: true })).not.toThrow();
      expect(() => is('hello', DataType.string, { exclEmpty: 'true' } as any)).toThrow();
      expect(() => is('hello', DataType.string, { exclEmpty: 1 } as any)).toThrow();
    });

    it('should detect invalid values assigned to `schema`', () => {
      expect(() => is({}, DataType.object, { schema: undefined })).not.toThrow();
      expect(() => is({}, DataType.object, { schema: null })).not.toThrow();
      expect(() => is({}, DataType.object, { schema: {} })).not.toThrow();
      expect(() => is({}, DataType.object, { schema: 'true' } as any)).toThrow();
    });

    it('should detect invalid values assigned to `arrayAsObject`', () => {
      expect(() => is([''], DataType.object, { arrayAsObject: undefined })).not.toThrow();
      expect(() => is([''], DataType.object, { arrayAsObject: true })).not.toThrow();
      expect(() => is([''], DataType.object, { arrayAsObject: 'true' } as any)).toThrow();
      expect(() => is([''], DataType.object, { arrayAsObject: 1 } as any)).toThrow();
    });

    it('should detect invalid values assigned to `min`', () => {
      expect(() => is(100, DataType.number, { min: undefined })).not.toThrow();
      expect(() => is(100, DataType.number, { min: 0 })).not.toThrow();
      expect(() => is(100, DataType.number, { min: '0' } as any)).toThrow();
      expect(() => is(100, DataType.number, { min: NaN })).toThrow();
    });

    it('should detect invalid values assigned to `max`', () => {
      expect(() => is(100, DataType.number, { max: undefined })).not.toThrow();
      expect(() => is(100, DataType.number, { max: 0 })).not.toThrow();
      expect(() => is(100, DataType.number, { max: '0' } as any)).toThrow();
      expect(() => is(100, DataType.number, { max: NaN })).toThrow();
    });

    it('should detect invalid values assigned to `multipleOf`', () => {
      expect(() => is(100, DataType.number, { multipleOf: undefined })).not.toThrow();
      expect(() => is(100, DataType.number, { multipleOf: 0 })).not.toThrow();
      expect(() => is(100, DataType.number, { multipleOf: '0' } as any)).toThrow();
      expect(() => is(100, DataType.number, { multipleOf: NaN })).toThrow();
    });

    it('should not fail when passed unexpected values', () => {
      expect(() => is(100, DataType.number, {})).not.toThrow();
      expect(() => is(100, DataType.number, null as any)).not.toThrow();
      expect(() => is(100, DataType.number, undefined)).not.toThrow();
      expect(() => is(100, DataType.number, NaN as any)).not.toThrow();
      expect(() => is(100, DataType.number, 'hello' as any)).not.toThrow();
      expect(() => is(100, DataType.number, Number.NEGATIVE_INFINITY as any)).not.toThrow();
      expect(() => is(100, DataType.number, new Date() as any)).not.toThrow();
    });
  });
});

// Symbols
// typeof Symbol() === 'symbol'
// typeof Symbol('foo') === 'symbol'
// typeof Symbol.iterator === 'symbol'
