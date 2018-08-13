import test from 'ava';
import { DataType, is } from '@lib';
import { matchesSchema } from '@lib-private';
import {
  getDataTypeUseCases,
  objectSchemaUseCases,
  optionalObjectUseCases,
  validObjectUseCases
} from './test-cases/index';

const currentDataType = DataType.object;

test('should work for regular use cases', t => {
  validObjectUseCases.forEach(n => {
    const msg = `Failed for ${n}`;
    t.true(is(n, currentDataType), msg);
    t.true(matchesSchema(n, { type: currentDataType }), msg);
  });
  optionalObjectUseCases.forEach(n => {
    const msg = `Failed for ${n}`;
    t.false(is(n.test, currentDataType), msg);
  });
});

test('should work in optional use cases', t => {
  optionalObjectUseCases.forEach(n => {
    const options = JSON.stringify(n.options);
    const msg = `Failed for ${n.test} with options ${options}`;
    t.true(is(n.test, currentDataType, n.options), msg);
    t.true(matchesSchema(n.test, { type: currentDataType, options: n.options }), msg);
  });
});

test('should work in optional schema use cases', t => {
  objectSchemaUseCases.forEach(n => {
    const val = JSON.stringify(n.test);
    const options = JSON.stringify(n.options);
    const msg = `Failed for ${val} with options ${options}: ${n.description}`;
    t.is(is(n.test, currentDataType, n.options), n.expect, msg);
    t.is(matchesSchema(n.test, { type: currentDataType, options: n.options }), n.expect, msg);
  });
});

test('should work when passed other data types', t => {
  getDataTypeUseCases(currentDataType).forEach(n => {
    const msg = `Failed for '${String(n)}' of type '${typeof n}' passed`;
    t.false(is(n, currentDataType), msg);
    t.false(matchesSchema(n, { type: currentDataType }), msg);
  });
});
