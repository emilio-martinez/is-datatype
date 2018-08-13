import test from 'ava';
import { DataType, is } from '@lib';
import { matchesSchema } from '@lib-private';
import {
  getDataTypeUseCases,
  integerUseCases,
  invalidNumberUseCases,
  multipleOfUseCases,
  naturalUseCases,
  numberRangeUseCases,
  validNumberNegativeUseCases,
  validNumberUseCases
} from './test-cases/index';

const currentDataType = DataType.number;

test('should work in regular use cases', t => {
  validNumberUseCases.forEach(n => {
    const msg = `Failed for use case ${n}`;
    t.true(is(n, currentDataType), msg);
    t.true(matchesSchema(n, { type: currentDataType }), msg);
  });
  validNumberNegativeUseCases.forEach(n => {
    const msg = `Failed for use case ${n}`;
    t.true(is(n, currentDataType), msg);
    t.true(matchesSchema(n, { type: currentDataType }), msg);
  });
  invalidNumberUseCases.forEach(n => {
    const msg = `Failed for use case ${n}`;
    t.false(is(n, currentDataType), msg);
    t.false(matchesSchema(n, { type: currentDataType }), msg);
  });
});

test('should work for range optional use cases', t => {
  numberRangeUseCases.forEach(n => {
    const options = JSON.stringify(n.options);
    const msg = `Failed for use case ${n.test} with options ${options}`;
    t.is(is(n.test, currentDataType, n.options), n.expect, msg);
    t.is(matchesSchema(n.test, { type: currentDataType, options: n.options }), n.expect, msg);
  });
});

test('should work for multipleOf optional use cases', t => {
  multipleOfUseCases.forEach(n => {
    const options = JSON.stringify(n.options);
    const msg = `Failed for options use case ${n.test} with options ${options}`;
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

test('should work for `integer` use cases', t => {
  const currentDataType = DataType.integer;

  integerUseCases.forEach(n => {
    const options = JSON.stringify(n.options);
    const msg = `Failed for use case ${n.test} with options ${options}`;
    t.is(is(n.test, currentDataType, n.options), n.expect, msg);
    t.is(matchesSchema(n.test, { type: currentDataType, options: n.options }), n.expect, msg);
  });
});

test('should work for `natural` use cases', t => {
  const currentDataType = DataType.natural;

  naturalUseCases.forEach(n => {
    const options = JSON.stringify(n.options);
    const msg = `Failed for use case ${n.test} with options ${options}`;
    t.is(is(n.test, currentDataType, n.options), n.expect, msg);
    t.is(matchesSchema(n.test, { type: currentDataType, options: n.options }), n.expect, msg);
  });
});
