import { DataType } from '../src/data-type';
import { isMultipleOf } from '../src/number-helpers';
import {
  getDataTypeUseCases,
  multipleOfUseCases,
  validNumberNegativeUseCases,
  validNumberUseCases
} from './test-cases/test-cases.spec';

describe('isMultipleOf', () => {
  it('should take any numeric value as multiple of 0', () => {
    [...validNumberNegativeUseCases, ...validNumberUseCases].forEach(v => {
      expect(isMultipleOf(v, 0)).toBe(true);
    });
  });

  it('should pass multipleOf test cases on its own', () => {
    multipleOfUseCases.forEach(({ test, options, expect: expectation }) => {
      expect(isMultipleOf(test, options.multipleOf)).toBe(expectation);
    });
  });

  it('should take any non-number value', () => {
    getDataTypeUseCases(DataType.number).forEach(v => {
      expect(isMultipleOf(v, 1)).toBe(false);
      expect(isMultipleOf(v, 0)).toBe(false);
      expect(isMultipleOf(v, Infinity)).toBe(false);
      expect(isMultipleOf(v, -Infinity)).toBe(false);
      expect(isMultipleOf(v, Number.POSITIVE_INFINITY)).toBe(false);
      expect(isMultipleOf(v, Number.NEGATIVE_INFINITY)).toBe(false);
    });
  });
});
