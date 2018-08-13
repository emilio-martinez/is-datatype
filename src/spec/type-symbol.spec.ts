import test from 'ava';
import { DataType, is } from '@lib';
import { matchesSchema } from '@lib-private';
import {
  FauxSymbolCoreJs,
  FauxSymbolES6Symbol,
  getDataTypeUseCases,
  safeString,
  validSymbolPolyfilledUseCases,
  validSymbolUseCases
} from './test-cases/index';

const currentDataType = DataType.symbol;

test('should work for regular use cases', t => {
  validSymbolUseCases.forEach(n => {
    const msg = `Failed for ${String(n)}`;
    t.true(is(n, currentDataType), msg);
    t.true(matchesSchema(n, { type: currentDataType }), msg);
  });
});

test('should work for polyfilled use cases', t => {
  /**
   * NOTE: These first checks are for internal testing assurances only
   * around how polyfills are handled. In short, they should be distinct
   * from the native implementation, and should not return 'symbol' for `typeof`.
   */
  t.deepEqual(global.Symbol, Symbol);
  t.notDeepEqual(FauxSymbolCoreJs, Symbol);
  t.is(typeof FauxSymbolCoreJs('a'), 'object');
  t.notDeepEqual(FauxSymbolES6Symbol, Symbol);
  t.is(typeof FauxSymbolES6Symbol('a'), 'object');

  validSymbolPolyfilledUseCases.forEach(n => {
    const msg = `Failed for ${n.toString()}`;
    t.true(is(n, currentDataType), msg);
    t.true(matchesSchema(n, { type: currentDataType }), msg);
  });
});

test('should work when passed other data types', t => {
  getDataTypeUseCases(currentDataType).forEach(n => {
    const msg = `Failed for '${safeString(n)}' of type '${typeof n}' passed`;
    t.false(is(n, currentDataType), msg);
    t.false(matchesSchema(n, { type: currentDataType }), msg);
  });
});
