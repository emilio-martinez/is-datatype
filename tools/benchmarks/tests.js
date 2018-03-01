// @ts-check

const { toKebabCase } = require('../utils/string');

const tests = [
  {
    name: 'Undefined (valid)',
    dataType: 'undefined',
    test: undefined
  },
  {
    name: 'Undefined (invalid)',
    dataType: 'undefined',
    test: 'undefined'
  },
  {
    name: 'Null (valid)',
    dataType: 'null',
    test: null
  },
  {
    name: 'Null (invalid)',
    dataType: 'null',
    test: 'null'
  },
  {
    name: 'Boolean (valid)',
    dataType: 'boolean',
    test: true
  },
  {
    name: 'Boolean (invalid)',
    dataType: 'boolean',
    test: 'boolean'
  },
  {
    name: 'Number (valid)',
    dataType: 'number',
    test: 10
  },
  {
    name: 'Number (invalid)',
    dataType: 'number',
    test: 'number'
  },
  {
    name: 'Integer (valid)',
    dataType: 'integer',
    test: 10
  },
  {
    name: 'Integer (invalid)',
    dataType: 'integer',
    test: 'integer'
  },
  {
    name: 'Natural (valid)',
    dataType: 'natural',
    test: 10
  },
  {
    name: 'Natural (invalid)',
    dataType: 'natural',
    test: 'natural'
  },
  {
    name: 'String (valid)',
    dataType: 'string',
    test: 'hello'
  },
  {
    name: 'String (invalid)',
    dataType: 'string',
    test: 10
  },
  {
    name: 'Function (valid)',
    dataType: 'function',
    test: () => {}
  },
  {
    name: 'Function (invalid)',
    dataType: 'function',
    test: 'function'
  },
  {
    name: 'Object (valid)',
    dataType: 'object',
    test: {}
  },
  {
    name: 'Object (invalid)',
    dataType: 'object',
    test: 'object'
  },
  {
    name: 'Array (valid)',
    dataType: 'array',
    test: []
  },
  {
    name: 'Array (invalid)',
    dataType: 'array',
    test: 'array'
  }
].map(t => Object.assign({}, t, { key: toKebabCase(t.name) }));

module.exports = {
  tests
};
