// tslint:disable object-literal-sort-keys no-empty

import { DataType } from '../src/data-type';
import { matchesSchema } from '../src/schema';
// eslint-disable-next-line no-unused-vars
import { isTypeSchema } from '../src/interfaces';

describe(`\`matchesSchema\` function`, () => {
  it(`should handle validating undefined`, () => {
    expect(
      matchesSchema(undefined as object, {
        type: DataType.undefined,
        props: { headline: { type: DataType.string } }
      })
    ).toBe(true);
  });

  it(`should test multiple schemas in addition to a single one`, () => {
    const testCases: {
      test: any;
      schema: isTypeSchema | isTypeSchema[];
      expect: boolean;
    }[] = [
      {
        test: [10, 'a'],
        schema: [{ type: DataType.number }, { type: DataType.string }],
        expect: true
      },
      { test: [10], schema: { type: DataType.number }, expect: true },
      { test: [10], schema: { type: DataType.string }, expect: false },
      { test: ['a'], schema: { type: DataType.number }, expect: false },
      { test: ['a'], schema: { type: DataType.string }, expect: true },
      {
        test: [10, 'a'],
        schema: [{ type: DataType.undefined }, { type: DataType.function }],
        expect: false
      }
    ];

    testCases.forEach(n =>
      n.test.forEach(m =>
        expect(matchesSchema(m, n.schema)).toBe(
          n.expect,
          `Failed for ${m} when \`type\` is ${JSON.stringify(n.schema)}`
        )
      )
    );
  });

  it(`should use \`any\`  as a \`DataType\` when no \`type\` is present`, () => {
    const testCases: any[] = [
      0,
      100,
      -20,
      'qwerty',
      ['qwerty', function() {}],
      { prop: 'val' },
      undefined,
      null,
      NaN
    ];

    testCases.forEach(n => expect(matchesSchema(n, {})).toBe(true, `Failed for ${n}`));
  });

  it(`should not mistake \`props\` from the schema with \`props\` attributes`, () => {
    const testCases = [
      { type: DataType.array, value: [] },
      { type: DataType.boolean, value: false },
      { type: DataType.boolean, value: true },
      { type: DataType.function, value: () => {} },
      { type: DataType.integer, value: -2 },
      { type: DataType.natural, value: 10 },
      { type: DataType.number, value: 3.14 },
      { type: DataType.object, value: {} },
      { type: DataType.string, value: '0' },
      { type: DataType.undefined, value: undefined }
    ];
    testCases.forEach(tc => {
      testMatchesSchema(
        { my: 'qwerty', props: tc.value },
        {
          props: {
            my: { type: DataType.string },
            props: { type: tc.type }
          }
        },
        true
      );
    });
  });

  it(`should execute \`matchesSchema\` for multiple depths of nested \`props\``, () => {
    testMatchesSchema(
      { my: 'qwerty', props: { my: () => {}, props: 100 } },
      {
        props: {
          my: { type: DataType.string },
          props: {
            type: DataType.object,
            props: {
              my: { type: DataType.function },
              props: { type: DataType.number }
            }
          }
        }
      },
      true
    );
  });

  it(`should not mistake \`items\` from the schema with \`items\` attributes`, () => {
    testMatchesSchema(
      [{ hello: () => {} }, { items: 10 }],
      {
        type: DataType.array,
        items: {
          type: DataType.object,
          props: {
            items: { type: DataType.number }
          }
        }
      },
      true
    );
  });

  it(`should validate \`items\` when Array is inferred, even if the \`type\` is \`any\``, () => {
    testMatchesSchema(['hello', 'goodbye'], { items: { type: DataType.string } }, true);
    testMatchesSchema(
      ['hello', 'goodbye'],
      { type: DataType.array, items: { type: DataType.string } },
      true
    );
    testMatchesSchema(['hello', 'goodbye'], { items: { type: DataType.number } }, false);
    testMatchesSchema(
      ['hello', 'goodbye'],
      { type: DataType.array, items: { type: DataType.number } },
      false
    );
    testMatchesSchema([0, false], { items: { type: [DataType.number, DataType.boolean] } }, true);
    testMatchesSchema(
      [0, false],
      { type: DataType.array, items: { type: [DataType.number, DataType.boolean] } },
      true
    );
    testMatchesSchema([0, false], { items: { type: DataType.boolean } }, false);
    testMatchesSchema(
      [0, false],
      { type: DataType.array, items: { type: DataType.boolean } },
      false
    );
  });

  it(`should execute \`matchesSchema\` for multiple depths of nested \`items\``, () => {
    testMatchesSchema(
      [['hello', 'world']],
      { items: { type: DataType.array, items: { type: DataType.string } } },
      true
    );
    testMatchesSchema(
      [['hello', false]],
      { items: { type: DataType.array, items: { type: DataType.string } } },
      false
    );
    testMatchesSchema(
      [['hello', false]],
      { items: { type: DataType.array, items: { type: [DataType.string, DataType.boolean] } } },
      true
    );
    testMatchesSchema(
      [[['hello'], [false]]],
      {
        items: {
          type: DataType.array,
          items: { type: DataType.array, items: { type: DataType.string } }
        }
      },
      false
    );
    testMatchesSchema(
      [[['hello'], [false]]],
      {
        items: {
          type: DataType.array,
          items: { type: DataType.array, items: { type: [DataType.string, DataType.boolean] } }
        }
      },
      true
    );
  });

  it(`should validate for \`required\` properties`, () => {
    testMatchesSchema(
      { my: 'qwerty', props: 100 },
      {
        props: {
          otherprop: { required: true },
          my: { type: DataType.string },
          props: { type: DataType.number }
        }
      },
      false
    );
    testMatchesSchema(
      { my: 'qwerty', props: 100, otherprop: {} },
      {
        props: {
          otherprop: { required: true },
          my: { type: DataType.string },
          props: { type: DataType.number }
        }
      },
      true
    );
    testMatchesSchema(
      { my: 'qwerty', props: 100, otherprop: {} },
      {
        props: {
          otherprop: { type: DataType.string, required: true },
          my: { type: DataType.string },
          props: { type: DataType.number }
        }
      },
      false
    );
    testMatchesSchema(
      { my: 'qwerty', props: 100, otherprop: {} },
      {
        props: {
          otherprop: { type: DataType.object, required: true },
          my: { type: DataType.string },
          props: { type: DataType.number }
        }
      },
      true
    );
    testMatchesSchema(
      { my: 'qwerty', props: 100, otherprop: {} },
      {
        props: {
          otherprop: { type: DataType.object, required: true },
          my: { type: DataType.string },
          props2: { type: DataType.number }
        }
      },
      true
    );
  });
});

function testMatchesSchema(val: any, schema: isTypeSchema | isTypeSchema[], testBool: boolean) {
  expect(matchesSchema(val, schema)).toBe(testBool);
}
