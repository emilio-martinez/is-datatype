import { test } from 'ava';
import { DataType } from '@lib';
import { DATATYPE, DT } from '@lib-private';
import { dataTypeKeys } from './test-cases/index';

test(`DataType should have value parity`, t => {
  const testedTypes: DataType[] = [];

  t.is(DataType.any, <DT>DATATYPE.any, 'Failed for `any`');
  testedTypes.push(DataType.any);
  t.is(DataType.undefined, <DT>DATATYPE.undefined, 'Failed for `undefined`');
  testedTypes.push(DataType.undefined);
  t.is(DataType.null, <DT>DATATYPE.null, 'Failed for `null`');
  testedTypes.push(DataType.null);
  t.is(DataType.boolean, <DT>DATATYPE.boolean, 'Failed for `boolean`');
  testedTypes.push(DataType.boolean);
  t.is(DataType.number, <DT>DATATYPE.number, 'Failed for `number`');
  testedTypes.push(DataType.number);
  t.is(DataType.integer, <DT>DATATYPE.integer, 'Failed for `integer`');
  testedTypes.push(DataType.integer);
  t.is(DataType.natural, <DT>DATATYPE.natural, 'Failed for `natural`');
  testedTypes.push(DataType.natural);
  t.is(DataType.string, <DT>DATATYPE.string, 'Failed for `string`');
  testedTypes.push(DataType.string);
  t.is(DataType.function, <DT>DATATYPE.function, 'Failed for `function`');
  testedTypes.push(DataType.function);
  t.is(DataType.object, <DT>DATATYPE.object, 'Failed for `object`');
  testedTypes.push(DataType.object);
  t.is(DataType.array, <DT>DATATYPE.array, 'Failed for `array`');
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
