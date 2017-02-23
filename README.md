# is

[![npm version][npm]][npm-url]
[![Build Status][tests]][tests-url]
[![Dependency Status][deps]][deps-url]
[![Coverage Status][cover]][cover-url]

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


## Usage

This package exposes three main exports through the main entry point: `is`, `DataType` and `isOptions`—a `function`, an `enum` and a Typescript `interface`, respectively. Those will be covered in the following subsections. Additionally, there are a number of other functions and interfaces exported via `is.internal` and `is.interfaces` which are mostly leveraged internally and therefore will not be covered here; however, if you're curious and/or want to use those pieces of functionality, they're available and documented in the source code.

### `DataType`

An `enum` called `DataType` is exported by this package with the sole purpose of providing an simple API to expose the supported data types, listed above. It's important to keep in mind that while recommended usage for `DataType` is through Typescript because of it's hinting, `enums`—and such is the case for `DataType`—will function the same way in any regular Javascript environment because they're output is simply an Object.

In a nutshell `DataType` functions as follows:

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

To learn more about Typescript `enums` please refer to [the Typescript docs](https://www.typescriptlang.org/docs/handbook/enums.html).

### `is`

`is` is the main function exported by this package. It takes the following three parameters to execute type validation:

* `val {any}`: The value to test for. In Typescript, the data type of the variable passed here will impact the hinting provided for `options`.
* `type {DataType}`: One of the DataType enum values with numeric output. It identifies the data type to validate for.
* `options {isOptions}`: An object described by the section "Options" further down. In Typescript, the options that the hinting will present will change depending on the data type of the variable passed into `val`.

A few usage examples to cover the basic use cases for `is`:

```ts
is(-10, DataType.number); // true
is(-10, DataType.boolean); // false

// `DataType.any` will validate `true` for any data type
is(-10, DataType.any); // true

// Because numbers are so vast, there's special treatment for certain particular number use cases
is(-10, DataType.integer); // true
is(-10, DataType.natural); // false

// Using options to affect validation
is(-10, DataType.number, { min: -10 }); // true
is(-10, DataType.number, { exclMin: -10 }); // false

// Another example using options
// Arrays have they're own data type, but can be allowed to be treated as objects, i.e., `typeof [] === 'object'`
is([], DataType.array); // true
is([], DataType.object); // false
is([], DataType.object, { arrayAsObject: true }); // true
```

Currently, `is` can take and validate for any data type with the exception of the data types listed in the "To do" section of this document.

### Options

There are a number of options available to `is`, but perhaps the most important detail to keep in mind is that there are specific option sets that will benefit certain data types exclusively, e.g., `exclEmpty` is only applicable to `string`. There is no negative impact to the validation outcome if options irrelevant to the data type being evaluated are passed into `is`; instead, the extraneous options will be ignored.

Because the options available to `is` are described by the `isOptions` interface, environments where Typescript is available will highly benefit from the hinting that is provided. This is particularly useful because IDEs will show only the valid available values relbased on to the variable data type being passed as the first parameter of `is`. In any regular Javascript enviorment, however, while there will be no type hinting benefits, the same exact functionality is available.

The default values for options are:

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

#### String options

Strings have an optional value to exclude empty values by passing `exclEmpty` into the options, which is a `boolean`.

#### Array options

* `type`: `DataType|DataType[]`
* `min`: `number`
* `max`: `number`
* `exclMin`: `number`
* `exclMax`: `number`

With the `type` option, arrays can be tested to see whether their values are of a single type or one of multiple types, in which case an array of types needs to be passed into the `type` option. To clarify, this is strictly testing for "one of multiple types"; as long as a single one of the types passed validates as `true`, then `is` will return `true`.

Additionally, arrays can be tested to have a `min`, `max`, `exclMin`, and `exclMax` lengths. `min` and `max` are inclusive in their checks (`>=` and `<=`, respectively), where `exclMin` and `exclMax` are check lengths exclusively (`<` and `>`, respectively).

#### Number options

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


[npm]: https://badge.fury.io/js/is-datatype.svg
[npm-url]: https://npmjs.com/package/is-datatype

[tests]: https://travis-ci.org/emilio-martinez/is-datatype.svg?branch=master
[tests-url]: https://travis-ci.org/emilio-martinez/is-datatype

[deps]: https://david-dm.org/emilio-martinez/is-datatype.svg
[deps-url]: https://npmjs.com/package/is-datatype

[cover]: https://coveralls.io/repos/github/emilio-martinez/is-datatype/badge.svg?branch=master
[cover-url]: https://coveralls.io/github/emilio-martinez/is-datatype?branch=master
