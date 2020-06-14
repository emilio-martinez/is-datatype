import test from 'ava';
import { DataType } from '@lib';
import { isMultipleOf } from '@lib-private';
import {
  getDataTypeUseCases,
  multipleOfUseCases,
  validNumberNegativeUseCases,
  validNumberUseCases
} from './test-cases/index';

test('should take any numeric value as multiple of 0', t => {
  [...validNumberNegativeUseCases, ...validNumberUseCases].forEach(v => {
    t.true(isMultipleOf(v, 0));
  });
});

test('should pass multipleOf test cases on its own', t => {
  multipleOfUseCases.forEach(({ test, options, expect: expectation }) => {
    t.is(isMultipleOf(test, options.multipleOf), expectation);
  });
});

test('should take any non-number value', t => {
  getDataTypeUseCases(DataType.number).forEach(v => {
    t.false(isMultipleOf(v as never, 1));
    t.false(isMultipleOf(v as never, 0));
    t.false(isMultipleOf(v as never, Infinity));
    t.false(isMultipleOf(v as never, -Infinity));
    t.false(isMultipleOf(v as never, Number.POSITIVE_INFINITY));
    t.false(isMultipleOf(v as never, Number.NEGATIVE_INFINITY));
  });
});
