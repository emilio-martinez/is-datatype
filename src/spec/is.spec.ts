import { is, DataType, isOptions, matchesSchema } from '../is.func';
import * as TC from './test-cases/test-cases.spec';

describe('`is` and `matchesSchema`', () => {

  describe('for `number` types', () => {
    const currentDataType = DataType.number;

    it('should work in regular use cases', () => {
      TC.validNumberUseCases
        .forEach( n =>
          expect( is(n, currentDataType) && matchesSchema(n, { type: currentDataType }) )
            .toBe(true, `Failed for valid \`${DataType[currentDataType]}\` use case ${n}`) );
      TC.validNumberNegativeUseCases
        .forEach( n =>
          expect( is(n, currentDataType) && matchesSchema(n, { type: currentDataType }) )
            .toBe(true, `Failed for valid negative \`${DataType[currentDataType]}\` use case ${n}`) );
      TC.invalidNumberUseCases
        .forEach( n =>
          expect( is(n, currentDataType) && matchesSchema(n, { type: currentDataType }) )
            .toBe(false, `Failed for invalid \`${DataType[currentDataType]}\` use case ${n}`) );
    });

    it('should work in optional use cases', () => {
      TC.numberRangeUseCases
        .forEach( n =>
          expect( is(n.test, currentDataType, n.options ) && matchesSchema(n.test, { type: currentDataType, options: n.options }) )
            .toBe(n.expect, `Failed for \`${DataType[currentDataType]}\` range options use case ${n.test} with options ${JSON.stringify(n.options)}`) );
      TC.multipleOfUseCases
        .forEach( n =>
          expect( is(n.test, currentDataType, n.options ) && matchesSchema(n.test, { type: currentDataType, options: n.options }) )
            .toBe(n.expect, `Failed for \`${DataType[currentDataType]}\` \`multipleOf\` options use case ${n.test} with options ${JSON.stringify(n.options)}`) );
    });

    it('should work when passed other data types', () => {
      TC.aggregateUseCases
        .filter( (n, i) => i !== currentDataType )
        .forEach( n =>
          n.forEach( m =>
            expect( is(m, currentDataType) && matchesSchema(m, { type: currentDataType }) )
              .toBe(false, `Failed for \`${m}\` of type \`${typeof m}\` passed when validating for \`${DataType[currentDataType]}\``) ) );
    });

    describe('particular use cases', () => {

      it('should work for `integer` use cases', () => {
        const currentDataType = DataType.integer;

        TC.integerUseCases
          .forEach( n =>
            expect( is(n.test, currentDataType, n.options ) && matchesSchema(n.test, { type: currentDataType, options: n.options }) )
              .toBe(n.expect, `Failed for \`${DataType[currentDataType]}\` use case ${n.test} with options ${JSON.stringify(n.options)}`) );
      });

      it('should work for `natural` use cases', () => {
        const currentDataType = DataType.natural;

        TC.naturalUseCases
          .forEach( n =>
            expect( is(n.test, currentDataType, n.options ) && matchesSchema(n.test, { type: currentDataType, options: n.options }) )
              .toBe(n.expect, `Failed for \`${DataType[currentDataType]}\` use case ${n.test} with options ${JSON.stringify(n.options)}`) );
      });

    });

  });

  describe('for `string` types', () => {
    const currentDataType = DataType.string;

    it('should work for regular use cases', () => {
      TC.validStringUseCases
        .forEach( n =>
          expect( is(n, currentDataType) && matchesSchema(n, { type: currentDataType }) )
            .toBe(true, `Failed for valid \`${DataType[currentDataType]}\` test ${n}`) );
      expect( is('', currentDataType) )
        .toBe(true, `Failed for valid \`${DataType[currentDataType]}\` test on an empty string`);
    });

    it('should work in optional use cases', () => {
      TC.validStringUseCases
        .forEach( n =>
          expect( is(n, currentDataType, { exclEmpty: true }) && matchesSchema(n, { type: currentDataType, options: { exclEmpty: true } }) )
            .toBe(true, `Failed for valid \`${DataType[currentDataType]}\` test with options ${n}`) );
      expect( is('', currentDataType, { exclEmpty: true }) && matchesSchema('', { type: currentDataType, options: { exclEmpty: true } }) )
        .toBe(false, `Failed for valid \`${DataType[currentDataType]}\` test with options on an empty string`);
      TC.stringPatternUseCases
        .forEach( n =>
          expect( is(n.test, currentDataType, n.options ) && matchesSchema(n.test, { type: currentDataType, options: n.options }) )
            .toBe(n.expect, `Failed for \`${DataType[currentDataType]}\` pattern use case ${n.test} with options ${JSON.stringify(n.options)}`) );
    });

    it('should work when passed other data types', () => {
      TC.aggregateUseCases
        .filter( (n, i) => i !== currentDataType )
        .forEach( n =>
          n.forEach( m =>
            expect( is(m, currentDataType) && matchesSchema(m, { type: currentDataType }) )
              .toBe(false, `Failed for \`${m}\` of type \`${typeof m}\` passed when validating for \`${DataType[currentDataType]}\``) ) );
    });

  });

  describe('for `boolean` types', () => {
    const currentDataType = DataType.boolean;

    it('should work for regular use cases', () => {
      TC.validBooleanUseCases
        .forEach( n =>
          expect( is(n, currentDataType) && matchesSchema(n, { type: currentDataType }) )
            .toBe(true, `Failed for valid \`${DataType[currentDataType]}\` test ${n}`) );
    });

    it('should work when passed other data types', () => {
      TC.aggregateUseCases
        .filter( (n, i) => i !== currentDataType )
        .forEach( n =>
          n.forEach( m =>
            expect( is(m, currentDataType) && matchesSchema(m, { type: currentDataType }) )
              .toBe(false, `Failed for \`${m}\` of type \`${typeof m}\` passed when validating for \`${DataType[currentDataType]}\``) ) );
    });

  });

  describe('for `array` types', () => {
    const currentDataType = DataType.array;

    it('should work for regular use cases', () => {
      TC.validArrayUseCases
        .forEach( n =>
          expect( is(n.test, currentDataType) && matchesSchema(n.test, { type: currentDataType }) )
            .toBe(true, `Failed for valid \`${DataType[currentDataType]}\` test ${n.test}`) );
    });

    it('should work in optional use cases', () => {
      TC.validArrayUseCases
        .forEach( n =>
          expect( is(n.test, currentDataType, n.options) && matchesSchema(n.test, { type: currentDataType, options: n.options }) )
            .toBe(true, `Failed for valid \`${DataType[currentDataType]}\` test ${n.test} with options ${JSON.stringify(n.options)}`) );
      TC.arrayWithOptionsUseCases
        .forEach( n =>
          expect( is(n.test, currentDataType, n.options) && matchesSchema(n.test, { type: currentDataType, options: n.options }) )
            .toBe(n.expect, `Failed for invalid \`${DataType[currentDataType]}\` test ${n.test} with options ${JSON.stringify(n.options)}. ${n['describe'] ? n['describe'] : ''}`) );
    });

    it('should work in optional schema use cases', () => {
      TC.arraySchemaUseCases
        .forEach( (n, i) =>
          expect( is(n.test, currentDataType, n.options) && matchesSchema(n.test, { type: currentDataType, options: n.options }) )
            .toBe(n.expect, `Failed for valid \`${DataType[currentDataType]}\` test ${JSON.stringify(n.test)} with options (${i}) ${JSON.stringify(n.options)}: ${n.description}`) );
    });

    it('should work when passed other data types', () => {
      TC.aggregateUseCases
        .filter( (n, i) => i !== currentDataType )
        .forEach( n =>
          n.forEach( m =>
            expect( is(m, currentDataType) && matchesSchema(m, { type: currentDataType }) )
              .toBe(false, `Failed for \`${m}\` of type \`${typeof m}\` passed when validating for \`${DataType[currentDataType]}\``) ) );
    });

  });

  describe('for `function` types', () => {
    const currentDataType = DataType.function;

    it('should work for regular use cases', () => {
      TC.validFunctionUseCases
        .forEach( n =>
          expect( is(n, currentDataType) && matchesSchema(n, { type: currentDataType }) )
            .toBe(true, `Failed for valid \`${DataType[currentDataType]}\` test ${n}`) );
    });

    it('should work when passed other data types', () => {
      TC.aggregateUseCases
        .filter( (n, i) => i !== currentDataType )
        .forEach( n =>
          n.forEach( m =>
            expect( is(m, currentDataType) && matchesSchema(m, { type: currentDataType }) )
              .toBe(false, `Failed for \`${m}\` of type \`${typeof m}\` passed when validating for \`${DataType[currentDataType]}\``) ) );
    });

  });

  describe('for `object` types', () => {
    const currentDataType = DataType.object;

    it('should work for regular use cases', () => {
      TC.validObjectUseCases
        .forEach( n =>
          expect( is(n, currentDataType) && matchesSchema(n, { type: currentDataType }) )
            .toBe(true, `Failed for valid \`${DataType[currentDataType]}\` test ${n}`) );
      TC.optionalObjectUseCases
        .forEach( n =>
          expect( is(n.test, currentDataType) )
            .toBe(false, `Failed for invalid \`${DataType[currentDataType]}\` test ${n}`) );
    });

    it('should work in optional use cases', () => {
      TC.optionalObjectUseCases
        .forEach( n =>
          expect( is(n.test, currentDataType, n.options) && matchesSchema(n.test, { type: currentDataType, options: n.options }) )
            .toBe(true, `Failed for valid \`${DataType[currentDataType]}\` test ${n.test} with options ${JSON.stringify(n.options)}`) );
    });

    it('should work in optional schema use cases', () => {
      TC.objectSchemaUseCases
        .forEach( n =>
          expect( is(n.test, currentDataType, n.options) && matchesSchema(n.test, { type: currentDataType, options: n.options }) )
            .toBe(n.expect, `Failed for valid \`${DataType[currentDataType]}\` test ${JSON.stringify(n.test)} with options ${JSON.stringify(n.options)}: ${n.description}`) );
    });

    it('should work when passed other data types', () => {
      TC.aggregateUseCases
        .filter( (n, i) => i !== currentDataType )
        .forEach( n =>
          n.forEach( m =>
            expect( is(m, currentDataType) && matchesSchema(m, { type: currentDataType }) )
              .toBe(false, `Failed for \`${m}\` of type \`${typeof m}\` passed when validating for \`${DataType[currentDataType]}\``) ) );
    });

  });

  describe('for `undefined` types', () => {
    const currentDataType = DataType.undefined;

    it('should work for regular use cases', () => {
      TC.validUndefinedUseCases
        .forEach( n =>
          expect( is(n, currentDataType) && matchesSchema(n, { type: currentDataType }) )
            .toBe(true, `Failed for valid \`${DataType[currentDataType]}\` test ${n}`) );
    });

    it('should work when passed other data types', () => {
      TC.aggregateUseCases
        .filter( (n, i) => i !== currentDataType )
        .forEach( n =>
          n.forEach( m =>
            expect( is(m, currentDataType) && matchesSchema(m, { type: currentDataType }) )
              .toBe(false, `Failed for \`${m}\` of type \`${typeof m}\` passed when validating for \`${DataType[currentDataType]}\``) ) );
    });

  });

  describe('for `any` types', () => {
    const currentDataType = DataType.any;

    it('should work for regular use cases', () => {
      TC.aggregateUseCases
        .filter( (n, i) => i !== currentDataType )
        .forEach( n =>
          n.forEach( m =>
            expect( is(m, currentDataType) && matchesSchema(m, { type: currentDataType }) )
              .toBe(true, `Failed for \`${m}\` of type \`${typeof m}\` passed when validating for \`${DataType[currentDataType]}\``) ) );
      expect( is(null, currentDataType) ).toBe(false, `Failed for valid \`${DataType[currentDataType]}\` test null`);
    });

    it('should work in optional use cases', () => {
      expect( is(null, currentDataType, { allowNull: true }) && matchesSchema(null, { type: currentDataType, options: { allowNull: true } }) )
        .toBe(true, `Failed for valid \`${DataType[currentDataType]}\` test null`);
    });

  });

});

// Symbols
// typeof Symbol() === 'symbol'
// typeof Symbol('foo') === 'symbol'
// typeof Symbol.iterator === 'symbol'
