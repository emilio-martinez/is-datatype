/* eslint-disable @typescript-eslint/no-empty-function */

import test from 'ava';
import { DataType, isTypeSchema } from '@lib';
import { matchesSchema } from '@lib-private';

test('should handle validating undefined', t => {
  t.true(
    matchesSchema(undefined, {
      type: DataType.undefined,
      props: { headline: { type: DataType.string } }
    })
  );
});

test(`should test multiple schemas in addition to a single one`, t => {
  const testCases: Array<{
    test: unknown[];
    schema: isTypeSchema | isTypeSchema[];
    expect: boolean;
  }> = [
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
    n.test.forEach(m => {
      t.is(
        matchesSchema(m, n.schema),
        n.expect,
        `Failed for ${m} when 'type' is ${JSON.stringify(n.schema)}`
      );
    })
  );
});

test(`should use 'any'  as a 'DataType' when no 'type' is present`, t => {
  const testCases: unknown[] = [
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

  testCases.forEach(n => {
    t.true(matchesSchema(n, {}), `Failed for ${n}`);
  });
});

test(`should not mistake 'props' from the schema with 'props' attributes`, t => {
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
    t.true(
      matchesSchema(
        { my: 'qwerty', props: tc.value },
        {
          props: {
            my: { type: DataType.string },
            props: { type: tc.type }
          }
        }
      )
    );
  });
});

test(`should execute 'matchesSchema' for multiple depths of nested 'props'`, t => {
  t.true(
    matchesSchema(
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
      }
    )
  );
});

test(`should not mistake 'items' from the schema with 'items' attributes`, t => {
  t.true(
    matchesSchema([{ hello: () => {} }, { items: 10 }], {
      type: DataType.array,
      items: {
        type: DataType.object,
        props: {
          items: { type: DataType.number }
        }
      }
    })
  );
});

test(`should validate 'items' when Array is inferred, even if the 'type' is 'any'`, t => {
  t.true(matchesSchema(['hello', 'goodbye'], { items: { type: DataType.string } }));
  t.true(
    matchesSchema(['hello', 'goodbye'], { type: DataType.array, items: { type: DataType.string } })
  );
  t.false(matchesSchema(['hello', 'goodbye'], { items: { type: DataType.number } }));
  t.false(
    matchesSchema(['hello', 'goodbye'], { type: DataType.array, items: { type: DataType.number } })
  );
  t.true(matchesSchema([0, false], { items: { type: [DataType.number, DataType.boolean] } }));
  t.true(
    matchesSchema([0, false], {
      type: DataType.array,
      items: { type: [DataType.number, DataType.boolean] }
    })
  );
  t.false(matchesSchema([0, false], { items: { type: DataType.boolean } }));
  t.false(matchesSchema([0, false], { type: DataType.array, items: { type: DataType.boolean } }));
});

test(`should execute 'matchesSchema' for multiple depths of nested 'items'`, t => {
  t.true(
    matchesSchema([['hello', 'world']], {
      items: { type: DataType.array, items: { type: DataType.string } }
    })
  );
  t.false(
    matchesSchema([['hello', false]], {
      items: { type: DataType.array, items: { type: DataType.string } }
    })
  );
  t.true(
    matchesSchema([['hello', false]], {
      items: { type: DataType.array, items: { type: [DataType.string, DataType.boolean] } }
    })
  );
  t.false(
    matchesSchema([[['hello'], [false]]], {
      items: {
        type: DataType.array,
        items: { type: DataType.array, items: { type: DataType.string } }
      }
    })
  );
  t.true(
    matchesSchema([[['hello'], [false]]], {
      items: {
        type: DataType.array,
        items: { type: DataType.array, items: { type: [DataType.string, DataType.boolean] } }
      }
    })
  );
});

test(`should validate for 'required' properties`, t => {
  t.false(
    matchesSchema(
      { my: 'qwerty', props: 100 },
      {
        props: {
          otherprop: { required: true },
          my: { type: DataType.string },
          props: { type: DataType.number }
        }
      }
    )
  );
  t.true(
    matchesSchema(
      { my: 'qwerty', props: 100, otherprop: {} },
      {
        props: {
          otherprop: { required: true },
          my: { type: DataType.string },
          props: { type: DataType.number }
        }
      }
    )
  );
  t.false(
    matchesSchema(
      { my: 'qwerty', props: 100, otherprop: {} },
      {
        props: {
          otherprop: { type: DataType.string, required: true },
          my: { type: DataType.string },
          props: { type: DataType.number }
        }
      }
    )
  );
  t.true(
    matchesSchema(
      { my: 'qwerty', props: 100, otherprop: {} },
      {
        props: {
          otherprop: { type: DataType.object, required: true },
          my: { type: DataType.string },
          props: { type: DataType.number }
        }
      }
    )
  );
  t.true(
    matchesSchema(
      { my: 'qwerty', props: 100, otherprop: {} },
      {
        props: {
          otherprop: { type: DataType.object, required: true },
          my: { type: DataType.string },
          props2: { type: DataType.number }
        }
      }
    )
  );
});
