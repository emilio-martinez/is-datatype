import { DataType } from '../../is.func'
import { isOptions } from '../../is.func'

export const validNumberUseCases = [37, 3.14, Math.LN2, Infinity, Number.POSITIVE_INFINITY, Number(1)]

export const validNumberNegativeUseCases = [Number.NEGATIVE_INFINITY, -37, -3.14, -Number.POSITIVE_INFINITY]

export const invalidNumberUseCases = [NaN, Number.NaN]

// prettier-ignore
export const numberRangeUseCases = [
  // `max` and `exclMax` tests against 0
  { test: 0,      options: { max: 0 },                expect: true },
  { test: -1,     options: { max: 0 },                expect: true },
  { test: 1,      options: { max: 0 },                expect: false },
  { test: 0,      options: { exclMax: 0 },            expect: false },
  { test: -1,     options: { exclMax: 0 },            expect: true },
  { test: 1,      options: { exclMax: 0 },            expect: false },
  { test: 0,      options: { max: 0, exclMax: 0 },    expect: false },
  { test: -1,     options: { max: 0, exclMax: 0 },    expect: true },
  { test: 1,      options: { max: 0, exclMax: 0 },    expect: false },

  // `max` and `exclMax` tests against -1 and 1
  { test: -1,     options: { max: -1 },               expect: true },
  { test: 1,      options: { max: 1 },                expect: true },
  { test: -1,     options: { exclMax: -1 },           expect: false },
  { test: 1,      options: { exclMax: 1 },            expect: false },
  { test: -1,     options: { max: -1, exclMax: -1 },  expect: false },
  { test: 1,      options: { max: 1, exclMax: 1 },    expect: false },

  // `min` and `exclMin` tests against 0
  { test: 0,      options: { min: 0 },                expect: true },
  { test: -1,     options: { min: 0 },                expect: false },
  { test: 1,      options: { min: 0 },                expect: true },
  { test: 0,      options: { exclMin: 0 },            expect: false },
  { test: -1,     options: { exclMin: 0 },            expect: false },
  { test: 1,      options: { exclMin: 0 },            expect: true },
  { test: 0,      options: { min: 0, exclMin: 0 },    expect: false },
  { test: -1,     options: { min: 0, exclMin: 0 },    expect: false },
  { test: 1,      options: { min: 0, exclMin: 0 },    expect: true },

  // `min` and `exclMin` tests against -1 and 1
  { test: -1,     options: { min: -1 },               expect: true },
  { test: 1,      options: { min: 1 },                expect: true },
  { test: -1,     options: { exclMin: -1 },           expect: false },
  { test: 1,      options: { exclMin: 1 },            expect: false },
  { test: -1,     options: { min: -1, exclMin: -1 },  expect: false },
  { test: 1,      options: { min: 1, exclMin: 1 },    expect: false },

  // `max` and `exclMax` tests against -3.14
  { test: -3.14,  options: { max: -3.14 },                  expect: true },
  { test: -3.15,  options: { max: -3.14 },                  expect: true },
  { test: -3.13,  options: { max: -3.14 },                  expect: false },
  { test: -3.14,  options: { exclMax: -3.14 },              expect: false },
  { test: -3.15,  options: { exclMax: -3.14 },              expect: true },
  { test: -3.13,  options: { exclMax: -3.14 },              expect: false },
  { test: -3.14,  options: { max: -3.14, exclMax: -3.14 },  expect: false },
  { test: -3.15,  options: { max: -3.14, exclMax: -3.14 },  expect: true },
  { test: -3.13,  options: { max: -3.14, exclMax: -3.14 },  expect: false },

  // `max` and `exclMax` tests against -3.15 and -3.13
  { test: -3.15,  options: { max: -3.15 },                  expect: true },
  { test: -3.13,  options: { max: -3.13 },                  expect: true },
  { test: -3.15,  options: { exclMax: -3.15 },              expect: false },
  { test: -3.13,  options: { exclMax: -3.13 },              expect: false },
  { test: -3.15,  options: { max: -3.15, exclMax: -3.15 },  expect: false },
  { test: -3.13,  options: { max: -3.13, exclMax: -3.13 },  expect: false },

  // `min` and `exclMin` tests against -3.14
  { test: -3.14,  options: { min: -3.14 },                  expect: true },
  { test: -3.15,  options: { min: -3.14 },                  expect: false },
  { test: -3.13,  options: { min: -3.14 },                  expect: true },
  { test: -3.14,  options: { exclMin: -3.14 },              expect: false },
  { test: -3.15,  options: { exclMin: -3.14 },              expect: false },
  { test: -3.13,  options: { exclMin: -3.14 },              expect: true },
  { test: -3.14,  options: { min: -3.14, exclMin: -3.14 },  expect: false },
  { test: -3.15,  options: { min: -3.14, exclMin: -3.14 },  expect: false },
  { test: -3.13,  options: { min: -3.14, exclMin: -3.14 },  expect: true },

  // `min` and `exclMin` tests against -3.15 and -3.13
  { test: -3.15,  options: { min: -3.15 },                  expect: true },
  { test: -3.13,  options: { min: -3.13 },                  expect: true },
  { test: -3.15,  options: { exclMin: -3.15 },              expect: false },
  { test: -3.13,  options: { exclMin: -3.13 },              expect: false },
  { test: -3.15,  options: { min: -3.15, exclMin: -3.15 },  expect: false },
  { test: -3.13,  options: { min: -3.13, exclMin: -3.13 },  expect: false },

  // With inconsequential option
  { test: -3.13,  options: { min: -3.13, exclMin: -3.13, someOtherProp: true },  expect: false },
];

// prettier-ignore
export const multipleOfUseCases = [
  { test: Number.POSITIVE_INFINITY,
                    options: { multipleOf: 1 },     expect: false },
  { test: Number.NEGATIVE_INFINITY,
                    options: { multipleOf: 1 },     expect: false },
  { test: 0,        options: { multipleOf: 1 },     expect: true },
  { test: 0,        options: { multipleOf: -1 },    expect: true },
  { test: 1,        options: { multipleOf: 1 },     expect: true },
  { test: 1,        options: { multipleOf: -1 },    expect: true },
  { test: 1,        options: { multipleOf: 2 },     expect: false },
  { test: 2,        options: { multipleOf: 2 },     expect: true },
  { test: 2,        options: { multipleOf: -2 },    expect: true },
  { test: -1,       options: { multipleOf: 1 },     expect: true },
  { test: -1,       options: { multipleOf: -1 },    expect: true },
  { test: -2,       options: { multipleOf: 2 },     expect: true },
  { test: -2,       options: { multipleOf: -2 },    expect: true },
  { test: 6.28,     options: { multipleOf: 3.14 },  expect: true },
  { test: -6.28,    options: { multipleOf: 3.14 },  expect: true },
  { test: 6.28,     options: { multipleOf: -3.14 }, expect: true },

  // With inconsequential option
  { test: 6.28,     options: { multipleOf: -3.14, someOtherProp: true }, expect: true }
];

// prettier-ignore
export const integerUseCases = [
  { test: 21,             options: {},  expect: true },
  { test: 4,              options: {},  expect: true },
  { test: 0,              options: {},  expect: true },
  { test: -2048,          options: {},  expect: true },
  { test: 3.14,           options: {},  expect: false },
  { test: Math.sqrt(2),   options: {},  expect: false },

  { test: 21,             options: { multipleOf: 2 },     expect: false },
  { test: 21,             options: { multipleOf: -3 },    expect: true },
  { test: 4,              options: { multipleOf: 2 },     expect: true },
  { test: 0,              options: { multipleOf: 2 },     expect: true },
  { test: -2048,          options: { multipleOf: 2 },     expect: true },
  { test: -2048,          options: { multipleOf: -512 },  expect: true },
  { test: 3.14,           options: { multipleOf: 2 },     expect: false },
  { test: Math.sqrt(2),   options: { multipleOf: 2 },     expect: false },
  { test: 3.14,           options: { multipleOf: 3.14 },  expect: false },

  // With inconsequential option
  { test: 3.14,           options: { multipleOf: 3.14, someOtherProp: true },  expect: false }
];

// prettier-ignore
export const naturalUseCases = [
  { test: 21,             options: {},  expect: true },
  { test: 4,              options: {},  expect: true },
  { test: 0,              options: {},  expect: true },
  { test: -2048,          options: {},  expect: false },
  { test: 3.14,           options: {},  expect: false },
  { test: Math.sqrt(2),   options: {},  expect: false },

  { test: 21,             options: { multipleOf: 2 },     expect: false },
  { test: 21,             options: { multipleOf: -3 },    expect: true },
  { test: 4,              options: { multipleOf: 2 },     expect: true },
  { test: 0,              options: { multipleOf: 2 },     expect: true },
  { test: -2048,          options: { multipleOf: 2 },     expect: false },
  { test: -2048,          options: { multipleOf: -512 },  expect: false },
  { test: 3.14,           options: { multipleOf: 2 },     expect: false },
  { test: Math.sqrt(2),   options: { multipleOf: 2 },     expect: false },
  { test: 3.14,           options: { multipleOf: 3.14 },  expect: false },

  { test: 21,             options: { min: 20 },  expect: true },
  { test: 21,             options: { min: 22 },  expect: false },
  { test: 4,              options: { max: 5 },  expect: true },
  { test: 4,              options: { max: 3 },  expect: false },
  { test: 0,              options: { max: 0 },  expect: true },
  { test: 0,              options: { exclMin: 0 },  expect: false },
  { test: 0,              options: { exclMax: 0 },  expect: false },

  // With inconsequential option
  { test: 0,              options: { exclMax: 0, someOtherProp: true },  expect: false }
];

export const validStringUseCases = [
  'bla',
  typeof 1, // `typeof` always returns a string
  String('abc')
]

// prettier-ignore
export const stringPatternUseCases = [
  { test: 'cdbbdbsbz',      options: { pattern: 'd(b+)d', patternFlags: 'g' },  expect: true },
  { test: 'hi there!',      options: { pattern: '!' },                          expect: true },
  { test: 'hi there!',      options: { pattern: '$' },                          expect: true },
  { test: 'hello world!',   options: { pattern: '^hello' },                     expect: true },
  { test: 'hello world!',   options: { pattern: 'hello$' },                     expect: false },
  { test: 'hello world!',   options: { pattern: 'world', patternFlags: 'g' },   expect: true },
  { test: 'HELLO WORLD!',   options: { pattern: 'world' },                      expect: false },
  { test: 'HELLO WORLD!',   options: { pattern: 'world', patternFlags: 'i' },   expect: true },
  { test: 'John Smith',     options: { pattern: '(\\w+)\\s(\\w+)' },            expect: true },

  // With inconsequential option
  { test: 'John Smith',     options: { pattern: '(\\w+)\\s(\\w+)', someOtherProp: true },  expect: true }
];

export const validBooleanUseCases = [true, false, Boolean(true)]

// prettier-ignore
export const validArrayUseCases = [
  { test: [1, 2, 4],              options: { type: DataType.number } },
  { test: [true, false],          options: { type: DataType.boolean } },
  { test: [() => {}],             options: { type: DataType.function } },
  { test: [{a:1}, new Object()],  options: { type: DataType.object } },
  { test: ['1', '2', '4'],        options: { type: DataType.string } },
  { test: [[1], [2], [4]],        options: { type: DataType.array } },

  // With inconsequential option
  { test: [[1], [2], [4]],        options: { type: DataType.array, someOtherProp: true } }
];

// prettier-ignore
export const arrayWithOptionsUseCases = [
  { test: [1, '2', 4],        options: { type: DataType.number },     expect: false },
  { test: [true, 'false'],    options: { type: DataType.boolean },    expect: false },
  { test: [() => {}, {a:1}],  options: { type: DataType.function },   expect: false },
  { test: [{a:1}, 4],         options: { type: DataType.object },     expect: false },
  { test: ['1', 2, '4'],      options: { type: DataType.string },     expect: false },
  { test: [[1], 2, [4]],      options: { type: DataType.array },      expect: false },

  { test: [1, '2', 4],        options: { type: [ DataType.number, DataType.string ] },     expect: true },
  { test: [true, 'false'],    options: { type: [ DataType.boolean, DataType.string ] },    expect: true },
  { test: [() => {}, {a:1}],  options: { type: [ DataType.function, DataType.object ] },   expect: true },
  { test: [{a:1}, 4],         options: { type: [ DataType.object, DataType.number ] },     expect: true },
  { test: ['1', 2, '4'],      options: { type: [ DataType.string, DataType.number ] },     expect: true },
  { test: [[1], 2, [4]],      options: { type: [ DataType.array, DataType.number ] },      expect: true },

  { test: [1],                options: { min: 2 },      expect: false },
  { test: [1, 2],             options: { min: 2 },      expect: true },
  { test: [1, 2],             options: { max: 2 },      expect: true },
  { test: [1, 2, 3],          options: { max: 2 },      expect: false },
  { test: [1, 2, 3],          options: { exclMax: 3 },      expect: false },
  { test: [1, 2],             options: { exclMax: 3 },      expect: true },
  { test: [1, 2, 3],          options: { exclMin: 3 },      expect: false },
  { test: [1, 2, 3, 4],       options: { exclMin: 3 },      expect: true },

  // With inconsequential option
  { test: [1, 2, 3, 4],       options: { exclMin: 3, someOtherProp: true },      expect: true }
];

export const validFunctionUseCases = [function() {}, class C {}, Math.sin]

export const validObjectUseCases = [{ a: 1 }, new Object()]

export const optionalObjectUseCases = [
  { test: null, options: { allowNull: true } },
  { test: [], options: { arrayAsObject: true } },

  // With inconsequential option
  { test: [], options: { arrayAsObject: true, someOtherProp: true } }
]

export const validUndefinedUseCases = [undefined]
