import test from 'ava';
import { DataType } from '@lib';
import { isOneOfMultipleTypes } from '@lib-private';
import { getDataTypeUseCases, safeString } from './test-cases/index';

const invalidTypeValues: unknown[] = [
  1000, // The DataType enum is an object with has numbers, but they don't come even close to 1000
  [1000],
  'hello',
  ['hello'],
  {},
  Function(),
  null,
  undefined
];

test(`should only take valid 'DataType' values for the 'type' argument`, t => {
  invalidTypeValues.forEach(n => {
    t.throws(() => isOneOfMultipleTypes(true, n as DataType), { instanceOf: TypeError });
  });
});

test(`should immediately return 'true' when 'any' is passed`, t => {
  getDataTypeUseCases().forEach(n => {
    const msg = `Failed for '${safeString(n)}' of type '${typeof n}'`;
    t.true(isOneOfMultipleTypes(n, DataType.any), msg);
    t.true(isOneOfMultipleTypes(n, [DataType.any]), msg);
  });
});

test(`should test multiple 'DataType' in addition to a single one`, t => {
  const testCases: Array<{
    test: unknown[];
    type: DataType | DataType[];
    expect: boolean;
  }> = [
    { test: [10, 'a'], type: [DataType.number, DataType.string], expect: true },
    { test: [10], type: DataType.number, expect: true },
    { test: [10], type: DataType.string, expect: false },
    { test: ['a'], type: DataType.number, expect: false },
    { test: ['a'], type: DataType.string, expect: true },
    { test: [10, 'a'], type: [DataType.undefined, DataType.function], expect: false }
  ];

  testCases.forEach(n =>
    n.test.forEach(m => {
      t.is(
        isOneOfMultipleTypes(m, n.type),
        n.expect,
        `Failed for ${m} when 'type' is ${JSON.stringify(n.type)}`
      );
    })
  );
});
