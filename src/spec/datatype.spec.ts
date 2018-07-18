import { test } from 'ava';
import { DataType } from '@lib';
import { DATATYPE } from '@lib-private';
import { dataTypeKeys } from './test-cases/index';

test(`DataType should have value parity`, t => {
  const testedTypes: DataType[] = [];

  t.is(DataType.any, DATATYPE.any as number, 'Failed for `any`');
  testedTypes.push(DataType.any);
  t.is(DataType.undefined, DATATYPE.undefined as number, 'Failed for `undefined`');
  testedTypes.push(DataType.undefined);
  t.is(DataType.null, DATATYPE.null as number, 'Failed for `null`');
  testedTypes.push(DataType.null);
  t.is(DataType.boolean, DATATYPE.boolean as number, 'Failed for `boolean`');
  testedTypes.push(DataType.boolean);
  t.is(DataType.number, DATATYPE.number as number, 'Failed for `number`');
  testedTypes.push(DataType.number);
  t.is(DataType.integer, DATATYPE.integer as number, 'Failed for `integer`');
  testedTypes.push(DataType.integer);
  t.is(DataType.natural, DATATYPE.natural as number, 'Failed for `natural`');
  testedTypes.push(DataType.natural);
  t.is(DataType.string, DATATYPE.string as number, 'Failed for `string`');
  testedTypes.push(DataType.string);
  t.is(DataType.function, DATATYPE.function as number, 'Failed for `function`');
  testedTypes.push(DataType.function);
  t.is(DataType.object, DATATYPE.object as number, 'Failed for `object`');
  testedTypes.push(DataType.object);
  t.is(DataType.array, DATATYPE.array as number, 'Failed for `array`');
  testedTypes.push(DataType.array);

  /** This test should validate that all types have been accounted for */
  t.is(
    Object.keys(DataType).length / 2,
    dataTypeKeys.length,
    '`dataTypeKeys` has an incorrect length'
  );
  t.true(
    dataTypeKeys.every(k => testedTypes.indexOf(k) >= 0),
    `There's a type that hasn't been accounted for.`
  );
});
