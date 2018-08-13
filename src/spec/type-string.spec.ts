import test from 'ava';
import { DataType, is } from '@lib';
import { matchesSchema } from '@lib-private';
import {
  getDataTypeUseCases,
  safeString,
  stringPatternUseCases,
  validStringUseCases
} from './test-cases/index';

const currentDataType = DataType.string;

test('should work for regular use cases', t => {
  validStringUseCases.forEach(n => {
    const msg = `Failed test ${n}`;
    t.true(is(n, currentDataType), msg);
    t.true(matchesSchema(n, { type: currentDataType }), msg);
  });

  t.true(is('', currentDataType), `Failed test on an empty string`);
});

test('should work in optional use cases', t => {
  const msg = `Failed test with options on an empty string`;
  t.false(is('', currentDataType, { exclEmpty: true }), msg);
  t.false(matchesSchema('', { type: currentDataType, options: { exclEmpty: true } }), msg);

  validStringUseCases.forEach(n => {
    const msg = `Failed test with options ${n}`;
    t.true(is(n, currentDataType, { exclEmpty: true }), msg);
    t.true(matchesSchema(n, { type: currentDataType, options: { exclEmpty: true } }), msg);
  });

  stringPatternUseCases.forEach(n => {
    const options = JSON.stringify(n.options);
    const msg = `Failed for use case ${n.test} with options ${options}`;
    t.is(is(n.test, currentDataType, n.options), n.expect, msg);
    t.is(matchesSchema(n.test, { type: currentDataType, options: n.options }), n.expect, msg);
  });
});

test('should work when passed other data types', t => {
  getDataTypeUseCases(currentDataType).forEach(n => {
    const msg = `Failed for '${safeString(n)}' of type '${typeof n}' passed`;
    t.false(is(n, currentDataType), msg);
    t.false(matchesSchema(n, { type: currentDataType }), msg);
  });
});
