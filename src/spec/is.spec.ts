import test from 'ava';
import { DataType, is } from '@lib';
import { matchesSchema } from '@lib-private';

/**
 * Type
 */

test('should disallow `type` arguments when out of range', (t) => {
  t.throws(() => is(false, -1));
  t.false(matchesSchema(false, { type: -1 }), 'Failed for -1');
  t.throws(() => is(false, 0));
  t.false(matchesSchema(false, { type: 0 }), 'Failed for 0');
  t.notThrows(() => is(false, 1));
  t.is(typeof matchesSchema(false, { type: 1 }), 'boolean', 'Failed for 1');
});

test('should disallow "named" DataType key for `type` arguments', (t) => {
  t.throws(() => is(false, DataType[1] as never));
  t.false(matchesSchema(false, { type: DataType[1] as never }));
});

test('should disallow undefined for `type` arguments', (t) => {
  t.throws(() => is(false, undefined as never));
  /** NOTE: `matchesSchema` here would ignore the `type` because it's optional */
});

/**
 * Options
 */

test('should detect invalid values assigned to `type`', (t) => {
  t.notThrows(() => is([''], DataType.array, { type: undefined }));
  t.notThrows(() => is([''], DataType.array, { type: DataType.string }));
  t.throws(() => is([''], DataType.array, { type: DataType[DataType.string] } as never));
});

test('should detect invalid values assigned to `pattern`', (t) => {
  t.notThrows(() => is('hello', DataType.string, { pattern: undefined }));
  t.notThrows(() => is('hello', DataType.string, { pattern: 'hello' }));
  t.throws(() => is('hello', DataType.string, { pattern: /(hello)/ } as never));
});

test('should detect invalid values assigned to `patternFlags`', (t) => {
  t.notThrows(() => is('hello', DataType.string, { patternFlags: undefined }));
  t.notThrows(() => is('hello', DataType.string, { patternFlags: '' }));
  t.notThrows(() => is('hello', DataType.string, { patternFlags: 'ig' }));
  t.throws(() => is('hello', DataType.string, { patternFlags: null } as never));
});

test('should detect invalid values assigned to `exclEmpty`', (t) => {
  t.notThrows(() => is('hello', DataType.string, { exclEmpty: undefined }));
  t.notThrows(() => is('hello', DataType.string, { exclEmpty: true }));
  t.throws(() => is('hello', DataType.string, { exclEmpty: 'true' } as never));
  t.throws(() => is('hello', DataType.string, { exclEmpty: 1 } as never));
});

test('should detect invalid values assigned to `schema`', (t) => {
  t.notThrows(() => is({}, DataType.object, { schema: undefined }));
  t.notThrows(() => is({}, DataType.object, { schema: null }));
  t.notThrows(() => is({}, DataType.object, { schema: {} }));
  t.throws(() => is({}, DataType.object, { schema: 'true' } as never));
});

test('should detect invalid values assigned to `arrayAsObject`', (t) => {
  t.notThrows(() => is([''], DataType.object, { arrayAsObject: undefined }));
  t.notThrows(() => is([''], DataType.object, { arrayAsObject: true }));
  t.throws(() => is([''], DataType.object, { arrayAsObject: 'true' } as never));
  t.throws(() => is([''], DataType.object, { arrayAsObject: 1 } as never));
});

test('should detect invalid values assigned to `min`', (t) => {
  t.notThrows(() => is(100, DataType.number, { min: undefined }));
  t.notThrows(() => is(100, DataType.number, { min: 0 }));
  t.throws(() => is(100, DataType.number, { min: '0' } as never));
  t.throws(() => is(100, DataType.number, { min: NaN }));
});

test('should detect invalid values assigned to `max`', (t) => {
  t.notThrows(() => is(100, DataType.number, { max: undefined }));
  t.notThrows(() => is(100, DataType.number, { max: 0 }));
  t.throws(() => is(100, DataType.number, { max: '0' } as never));
  t.throws(() => is(100, DataType.number, { max: NaN }));
});

test('should detect invalid values assigned to `multipleOf`', (t) => {
  t.notThrows(() => is(100, DataType.number, { multipleOf: undefined }));
  t.notThrows(() => is(100, DataType.number, { multipleOf: 0 }));
  t.throws(() => is(100, DataType.number, { multipleOf: '0' } as never));
  t.throws(() => is(100, DataType.number, { multipleOf: NaN }));
});

test('should not fail when passed unexpected values', (t) => {
  t.notThrows(() => is(100, DataType.number, {}));
  t.notThrows(() => is(100, DataType.number, null as never));
  t.notThrows(() => is(100, DataType.number, undefined));
  t.notThrows(() => is(100, DataType.number, NaN as never));
  t.notThrows(() => is(100, DataType.number, 'hello' as never));
  t.notThrows(() => is(100, DataType.number, Number.NEGATIVE_INFINITY as never));
  t.notThrows(() => is(100, DataType.number, new Date() as never));
});
