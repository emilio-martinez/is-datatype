# is

[![npm version](https://badge.fury.io/js/is-datatype.svg)](https://badge.fury.io/js/is-datatype)
[![Build Status](https://travis-ci.org/emilio-martinez/is-datatype.svg?branch=master)](https://travis-ci.org/emilio-martinez/is-datatype)

Type validation function meant to go beyond the use cases of operators such as `typeof`. A few of the key features in mind with the creation of this package are:

* Providing a few more common pseudo data types to check against
* Tooling (via Typescript)
* A certain degree of options to validate against

The data types available to test for are:

* `boolean`
* `number`
* `integer`: Validates for numbers, restricting to only [integers](https://en.wikipedia.org/wiki/Integer);
* `natural`: Validates for numbers, restricting to only to [natural numbers](https://en.wikipedia.org/wiki/Natural_number), i.e., non-negative.
* `string`
* `function`
* `object`
* `array`
* `undefined`
* `any`: catch all

This function is opinionated in the sense that:

* When testing for `object` and `any`, `null` will be disallowed by default. If desired, an optional `allowNull` can be passed to allow that use case.
* When testing for an `object`, Arrays will be disallowed by default. If desired, an optional `arrayAsObject` can be passed to allow that use case. Note that there is a separate check for `array`.
* When testing for `number`, `integer`, or `natural`, `NaN` will be disallowed at all times.

## `DataType`

An `enum` called `DataType` is exported by this package to expose the types available above. Because this package is exported with Typescript in mind, this is meant to provide hinting throughout the use of `is`.

In a nutshell:

```ts
// `DataType` named properties return natural numbers
// The number returned by `DataType` refers to an object index in the `DataType` object.
// Typescript tooling makes this very easy to use for development
typeof DataType.array === 'number'
DataType.number === 1

// Calling `DataType` numbered properties as shown below will return strings of the named property
typeof DataType[DataType.number] === 'string'
DataType[DataType.number] === 'number'
```

Read more about Typescript `enums` [in the Typescript docs](https://www.typescriptlang.org/docs/handbook/enums.html).


## Options

The default optional values are:

```ts
type: DataType.any // Used for `array` use cases
exclEmpty: false // Used for `string` use cases
schema: null // Used for `object` and `any` use cases
allowNull: false // Used for `object` and `any` use cases
arrayAsObject: false // Used for `object` use cases
min: Number.NEGATIVE_INFINITY // Used for `number` use cases
max: Number.POSITIVE_INFINITY // Used for `number` use cases
exclMin: Number.NEGATIVE_INFINITY // Used for `number` use cases
exclMax: Number.POSITIVE_INFINITY // Used for `number` use cases
multipleOf: 0 // Used for `number` use cases. `0` means no `multipleOf` check
```

### String options

Strings have an optional value to exclude empty values by passing `exclEmpty` into the options, which is a `boolean`.

### Array options

* `type`: `DataType|DataType[]`
* `min`: `number`
* `max`: `number`
* `exclMin`: `number`
* `exclMax`: `number`

With the `type` option, arrays can be tested to see whether their values are of a single type or one of multiple types, in which case an array of types needs to be passed into the `type` option. To clarify, this is strictly testing for "one of multiple types"; as long as a single one of the types passed validates as `true`, then `is` will return `true`.

Additionally, arrays can be tested to have a `min`, `max`, `exclMin`, and `exclMax` lengths. `min` and `max` are inclusive in their checks (`>=` and `<=`, respectively), where `exclMin` and `exclMax` are check lengths exclusively (`<` and `>`, respectively).

### Number options

* `min`: `number`
* `max`: `number`
* `exclMin`: `number`
* `exclMax`: `number`
* `multipleOf`: `number`

As with Arrays, `exclMin` and `exclMax` are exclusive variants of `min` and `max` with the exception of negative and positive infinity.

`multipleOf` will check whether the number being evaluated is a multiple of the value in this option. Please note that when negative and positive infinities are used as the value to test for, the use of `multipleOf` will result in `false` because using Infinity on the left side of modulus is `NaN`.

When checking for `integer` and `natural` the `number` options apply as well, being that they are particular use cases of `number`.

## To do

* Use cases for `symbol`
* Document `schema` options

## Collaboration

If there's any issues, a strong use case to change something implemented, or any features to be added other than those noted in the "To do" section above, please feel free to open issues or create pull requests. However, please bear in mind that unit tests must be provided for pull requests, and that keeping (or enhancing) the Typescript tooling that `is` may provide is an important part of this package.