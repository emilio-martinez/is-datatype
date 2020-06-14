/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */

import { DataType, isOptionsArray, isOptionsNumber, isOptionsObject, isOptionsString } from '@lib';

/**
 * The below Symbol polyfills are being required in a way that won't pollute
 * the global namespace. However, the `Symbol` global is removed temporarily
 * because otherwise they'll try to leverage what they can get from the
 * native implementation.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires */
const NativeSymbol = Symbol as SymbolConstructor;
global.Symbol = null as any;
const FauxSymbolCoreJs = require('core-js-pure').Symbol;
const FauxSymbolES6Symbol = require('es6-symbol/polyfill');
global.Symbol = NativeSymbol;
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires */

export const validNumberUseCases: number[] = [
  37,
  3.14,
  Math.LN2,
  Infinity,
  Number.POSITIVE_INFINITY,
  Number(1)
];

export const validNumberNegativeUseCases: number[] = [
  Number.NEGATIVE_INFINITY,
  -37,
  -3.14,
  -Number.POSITIVE_INFINITY
];

export const invalidNumberUseCases: number[] = [NaN, Number.NaN];

export const numberRangeUseCases: Array<{
  test: number;
  options: isOptionsNumber;
  expect: boolean;
}> = [
  // `max` tests against 0
  { test: 0, options: { max: 0 }, expect: true },
  { test: -1, options: { max: 0 }, expect: true },
  { test: 1, options: { max: 0 }, expect: false },

  // `max` tests against -1 and 1
  { test: -1, options: { max: -1 }, expect: true },
  { test: 1, options: { max: 1 }, expect: true },

  // `min` tests against 0
  { test: 0, options: { min: 0 }, expect: true },
  { test: -1, options: { min: 0 }, expect: false },
  { test: 1, options: { min: 0 }, expect: true },

  // `min` tests against -1 and 1
  { test: -1, options: { min: -1 }, expect: true },
  { test: 1, options: { min: 1 }, expect: true },

  // `max` tests against -3.14
  { test: -3.14, options: { max: -3.14 }, expect: true },
  { test: -3.15, options: { max: -3.14 }, expect: true },
  { test: -3.13, options: { max: -3.14 }, expect: false },

  // `max` tests against -3.15 and -3.13
  { test: -3.15, options: { max: -3.15 }, expect: true },
  { test: -3.13, options: { max: -3.13 }, expect: true },

  // `min` tests against -3.14
  { test: -3.14, options: { min: -3.14 }, expect: true },
  { test: -3.15, options: { min: -3.14 }, expect: false },
  { test: -3.13, options: { min: -3.14 }, expect: true },

  // `min` tests against -3.15 and -3.13
  { test: -3.15, options: { min: -3.15 }, expect: true },
  { test: -3.13, options: { min: -3.13 }, expect: true }
];

export const multipleOfUseCases: Array<{
  test: number;
  options: isOptionsNumber;
  expect: boolean;
}> = [
  { test: Number.POSITIVE_INFINITY, options: { multipleOf: 1 }, expect: false },
  { test: Number.NEGATIVE_INFINITY, options: { multipleOf: 1 }, expect: false },
  { test: 0, options: { multipleOf: 1 }, expect: true },
  { test: 0, options: { multipleOf: -1 }, expect: true },
  { test: 1, options: { multipleOf: 1 }, expect: true },
  { test: 1, options: { multipleOf: -1 }, expect: true },
  { test: 1, options: { multipleOf: 2 }, expect: false },
  { test: 2, options: { multipleOf: 2 }, expect: true },
  { test: 2, options: { multipleOf: -2 }, expect: true },
  { test: -1, options: { multipleOf: 1 }, expect: true },
  { test: -1, options: { multipleOf: -1 }, expect: true },
  { test: -2, options: { multipleOf: 2 }, expect: true },
  { test: -2, options: { multipleOf: -2 }, expect: true },
  { test: 6.28, options: { multipleOf: 3.14 }, expect: true },
  { test: -6.28, options: { multipleOf: 3.14 }, expect: true },
  { test: 6.28, options: { multipleOf: -3.14 }, expect: true }
];

export const integerUseCases: Array<{
  test: number;
  options: isOptionsNumber;
  expect: boolean;
}> = [
  { test: 21, options: {}, expect: true },
  { test: 4, options: {}, expect: true },
  { test: 0, options: {}, expect: true },
  { test: -2048, options: {}, expect: true },
  { test: 3.14, options: {}, expect: false },
  { test: Math.sqrt(2), options: {}, expect: false },

  { test: 21, options: { multipleOf: 2 }, expect: false },
  { test: 21, options: { multipleOf: -3 }, expect: true },
  { test: 4, options: { multipleOf: 2 }, expect: true },
  { test: 0, options: { multipleOf: 2 }, expect: true },
  { test: -2048, options: { multipleOf: 2 }, expect: true },
  { test: -2048, options: { multipleOf: -512 }, expect: true },
  { test: 3.14, options: { multipleOf: 2 }, expect: false },
  { test: Math.sqrt(2), options: { multipleOf: 2 }, expect: false },
  { test: 3.14, options: { multipleOf: 3.14 }, expect: false }
];

export const naturalUseCases: Array<{
  test: number;
  options: isOptionsNumber;
  expect: boolean;
}> = [
  { test: 21, options: {}, expect: true },
  { test: 4, options: {}, expect: true },
  { test: 0, options: {}, expect: true },
  { test: -2048, options: {}, expect: false },
  { test: 3.14, options: {}, expect: false },
  { test: Math.sqrt(2), options: {}, expect: false },

  { test: 21, options: { multipleOf: 2 }, expect: false },
  { test: 21, options: { multipleOf: -3 }, expect: true },
  { test: 4, options: { multipleOf: 2 }, expect: true },
  { test: 0, options: { multipleOf: 2 }, expect: true },
  { test: -2048, options: { multipleOf: 2 }, expect: false },
  { test: -2048, options: { multipleOf: -512 }, expect: false },
  { test: 3.14, options: { multipleOf: 2 }, expect: false },
  { test: Math.sqrt(2), options: { multipleOf: 2 }, expect: false },
  { test: 3.14, options: { multipleOf: 3.14 }, expect: false },

  { test: 21, options: { min: 20 }, expect: true },
  { test: 21, options: { min: 22 }, expect: false },
  { test: 4, options: { max: 5 }, expect: true },
  { test: 4, options: { max: 3 }, expect: false },
  { test: 0, options: { max: 0 }, expect: true }
];

export const validStringUseCases: string[] = [
  'bla',
  typeof 1, // `typeof` always returns a string
  String('abc')
];

export const stringPatternUseCases: Array<{
  test: string;
  options: isOptionsString;
  expect: boolean;
}> = [
  { test: 'cdbbdbsbz', options: { pattern: 'd(b+)d', patternFlags: 'g' }, expect: true },
  { test: 'hi there!', options: { pattern: '!' }, expect: true },
  { test: 'hi there!', options: { pattern: '$' }, expect: true },
  { test: 'hello world!', options: { pattern: '^hello' }, expect: true },
  { test: 'hello world!', options: { pattern: 'hello$' }, expect: false },
  { test: 'hello world!', options: { pattern: 'world', patternFlags: 'g' }, expect: true },
  { test: 'HELLO WORLD!', options: { pattern: 'world' }, expect: false },
  { test: 'HELLO WORLD!', options: { pattern: 'world', patternFlags: 'i' }, expect: true },
  { test: 'John Smith', options: { pattern: '(\\w+)\\s(\\w+)' }, expect: true }
];

export const validBooleanUseCases = [true, false, Boolean(true)];

export const validArrayUseCases: Array<{
  test: unknown[];
  options: isOptionsArray;
}> = [
  { test: [1, 2, 4], options: { type: DataType.number } },
  { test: [true, false], options: { type: DataType.boolean } },
  { test: [() => {}], options: { type: DataType.function } },
  { test: [{ a: 1 }, {}], options: { type: DataType.object } },
  { test: ['1', '2', '4'], options: { type: DataType.string } },
  { test: [[1], [2], [4]], options: { type: DataType.array } }
];

export const arrayWithOptionsUseCases: Array<{
  test: unknown[];
  options: isOptionsArray;
  expect: boolean;
}> = [
  { test: [1, '2', 4], options: { type: DataType.number }, expect: false },
  { test: [true, 'false'], options: { type: DataType.boolean }, expect: false },
  { test: [() => {}, { a: 1 }], options: { type: DataType.function }, expect: false },
  { test: [{ a: 1 }, 4], options: { type: DataType.object }, expect: false },
  { test: ['1', 2, '4'], options: { type: DataType.string }, expect: false },
  { test: [[1], 2, [4]], options: { type: DataType.array }, expect: false },

  { test: [1, '2', 4], options: { type: [DataType.number, DataType.string] }, expect: true },
  { test: [true, 'false'], options: { type: [DataType.boolean, DataType.string] }, expect: true },
  {
    test: [() => {}, { a: 1 }],
    options: { type: [DataType.function, DataType.object] },
    expect: true
  },
  { test: [{ a: 1 }, 4], options: { type: [DataType.object, DataType.number] }, expect: true },
  { test: ['1', 2, '4'], options: { type: [DataType.string, DataType.number] }, expect: true },
  { test: [[1], 2, [4]], options: { type: [DataType.array, DataType.number] }, expect: true },

  { test: [1], options: { min: 2 }, expect: false },
  { test: [1, 2], options: { min: 2 }, expect: true },
  { test: [1, 2], options: { max: 2 }, expect: true },
  { test: [1, 2, 3], options: { max: 2 }, expect: false }
];

// eslint-disable-next-line @typescript-eslint/ban-types
export const validFunctionUseCases: Function[] = [function() {}, class C {}, Math.sin];

export const validObjectUseCases: Record<string, unknown>[] = [
  { a: 1 },
  {},
  new (class Symbol {})()
];

export const optionalObjectUseCases: Array<{
  test: unknown[];
  options: isOptionsObject;
}> = [{ test: [], options: { arrayAsObject: true } }];

export const validNullUseCases: null[] = [null];

export const validUndefinedUseCases: undefined[] = [undefined];

export const validSymbolUseCases: symbol[] = [Symbol('a'), Symbol.for('b'), Symbol.iterator];

export const validSymbolPolyfilledUseCases: symbol[] = [
  FauxSymbolCoreJs('c'),
  FauxSymbolES6Symbol('d')
];

export { FauxSymbolCoreJs, FauxSymbolES6Symbol };
