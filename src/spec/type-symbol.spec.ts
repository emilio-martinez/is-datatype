import test from 'ava';
import { DataType, is } from '@lib';
import { matchesSchema } from '@lib-private';
import { getDataTypeUseCases, validSymbolUseCases } from './test-cases/index';

const currentDataType = DataType.symbol;

test('should work for regular use cases', t => {
  validSymbolUseCases.forEach(n => {
    const msg = `Failed for ${String(n)}`;
    t.true(is(n, currentDataType), msg);
    t.true(matchesSchema(n, { type: currentDataType }), msg);
  });
});

test('should work when passed other data types', t => {
  getDataTypeUseCases(currentDataType).forEach(n => {
    const msg = `Failed for '${String(n)}' of type '${typeof n}' passed`;
    t.false(is(n, currentDataType), msg);
    t.false(matchesSchema(n, { type: currentDataType }), msg);
  });
});
