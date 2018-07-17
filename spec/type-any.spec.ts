import { test } from 'ava';
import { is } from '../src/is';
import { DataType } from '../src/data-type';
import { matchesSchema } from '../src/schema';
import { getDataTypeUseCases } from './test-cases/index';

const currentDataType = DataType.any;

test('should work for regular use cases', t => {
  getDataTypeUseCases(currentDataType).forEach(n => {
    const msg = `Failed for \`${n}\` of type \`${typeof n}\` passed`;
    t.true(is(n, currentDataType), msg);
    t.true(matchesSchema(n, { type: currentDataType }), msg);
  });
  t.true(is(null, currentDataType), `Failed for null`);
});
