import { DataType, isTypeSchema, matchesSchema } from '../is.func';

describe(`\`matchesSchema\` function`, () => {

  it(`should handle validating undefined`, () => {
    expect( matchesSchema(undefined as Object, { type: DataType.undefined, props: { headline: { type: DataType.string } } } ) ).toBe(true);
  });

  it(`should test multiple schemas in addition to a single one`, () => {
    const testCases: {
      test: any,
      schema: isTypeSchema|isTypeSchema[],
      expect: boolean
    }[] = [
      { test: [ 10, 'a' ], schema: [ { type: DataType.number }, { type: DataType.string } ], expect: true },
      { test: [ 10 ], schema: { type: DataType.number }, expect: true },
      { test: [ 10 ], schema: { type: DataType.string }, expect: false },
      { test: [ 'a' ], schema: { type: DataType.number }, expect: false },
      { test: [ 'a' ], schema: { type: DataType.string }, expect: true },
      { test: [ 10, 'a' ], schema: [ { type: DataType.undefined }, { type: DataType.function } ], expect: false }
    ];

    testCases
      .forEach( n =>
        n.test.forEach( m =>
          expect( matchesSchema(m, n.schema) )
            .toBe(n.expect, `Failed for ${m} when \`type\` is ${JSON.stringify(n.schema)}`) ) );
  });

  it(`should use \`any\  as a \`DataType\` when no \`type\` is present`, () => {
    const testCases: any[] = [
      0,
      100,
      -20,
      'qwerty',
      [ 'qwerty', function(){} ],
      { prop: 'val' },
      undefined,
      null,
      NaN
    ];

    testCases
      .forEach( n =>
        expect( matchesSchema(n, {}) )
          .toBe(true, `Failed for ${n}`) );
  });

  it(`should execute \`matchesSchema\` recursively for \`props\``, () => {
    expect( matchesSchema(
      { my: 'qwerty', props: 100 },
      {
        props: {
          my: { type: DataType.string },
          props: { type: DataType.number }
        }
      }
    ) ).toBe(true);
  });

  it(`should execute \`matchesSchema\` recursively for \`items\``, () => {
    expect( matchesSchema(
      ['hello', 'world'],
      {
        type: DataType.array,
        items: { type: DataType.string }
      }
    ) ).toBe(true);
    expect( matchesSchema(
        ['hello', 100],
        {
          type: DataType.array,
          items: { type: DataType.string }
        }
    ) ).toBe(false);
  });

  it(`should validate for \`required\` properties`, () => {
    expect( matchesSchema(
      { my: 'qwerty', props: 100 },
      {
        props: {
          otherprop: { required: true },
          my: { type: DataType.string },
          props: { type: DataType.number }
        }
      }
    ) ).toBe(false);
    expect( matchesSchema(
      { my: 'qwerty', props: 100, otherprop: {} },
      {
        props: {
          otherprop: { required: true },
          my: { type: DataType.string },
          props: { type: DataType.number }
        }
      }
    ) ).toBe(true);
    expect( matchesSchema(
      { my: 'qwerty', props: 100, otherprop: {} },
      {
        props: {
          otherprop: { type: DataType.string, required: true },
          my: { type: DataType.string },
          props: { type: DataType.number }
        }
      }
    ) ).toBe(false);
    expect( matchesSchema(
      { my: 'qwerty', props: 100, otherprop: {} },
      {
        props: {
          otherprop: { type: DataType.object, required: true },
          my: { type: DataType.string },
          props: { type: DataType.number }
        }
      }
    ) ).toBe(true);
    expect( matchesSchema(
      { my: 'qwerty', props: 100, otherprop: {} },
      {
        props: {
          otherprop: { type: DataType.object, required: true },
          my: { type: DataType.string },
          props2: { type: DataType.number }
        }
      }
    ) ).toBe(true);
  });

});
