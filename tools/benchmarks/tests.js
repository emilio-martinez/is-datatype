// @ts-check

/**
 * @typedef {Object} BenchmarkTestConfig
 * @property {string} name - The human-readable name of the test
 * @property {string} dataType - The data type the test will test for
 * @property {any} test - The value that will be tested against the dataType
 */

const { toKebabCase } = require('../utils/string');

class BenchmarkTest {
  /**
   * Creates an instance of BenchmarkTest.
   * @param {BenchmarkTestConfig} config
   */
  constructor(config) {
    this.name = config.name;
    this.dataType = config.dataType;
    this.test = config.test;
    this.key = toKebabCase(this.name);
  }
}

const tests = [
  new BenchmarkTest({
    name: 'Undefined (valid)',
    dataType: 'undefined',
    test: undefined
  }),
  new BenchmarkTest({
    name: 'Undefined (valid)',
    dataType: 'undefined',
    test: undefined
  }),
  new BenchmarkTest({
    name: 'Undefined (invalid)',
    dataType: 'undefined',
    test: 'undefined'
  }),
  new BenchmarkTest({
    name: 'Null (valid)',
    dataType: 'null',
    test: null
  }),
  new BenchmarkTest({
    name: 'Null (invalid)',
    dataType: 'null',
    test: 'null'
  }),
  new BenchmarkTest({
    name: 'Boolean (valid)',
    dataType: 'boolean',
    test: true
  }),
  new BenchmarkTest({
    name: 'Boolean (invalid)',
    dataType: 'boolean',
    test: 'boolean'
  }),
  new BenchmarkTest({
    name: 'Number (valid)',
    dataType: 'number',
    test: 10
  }),
  new BenchmarkTest({
    name: 'Number (invalid)',
    dataType: 'number',
    test: 'number'
  }),
  new BenchmarkTest({
    name: 'Integer (valid)',
    dataType: 'integer',
    test: 10
  }),
  new BenchmarkTest({
    name: 'Integer (invalid)',
    dataType: 'integer',
    test: 'integer'
  }),
  new BenchmarkTest({
    name: 'Natural (valid)',
    dataType: 'natural',
    test: 10
  }),
  new BenchmarkTest({
    name: 'Natural (invalid)',
    dataType: 'natural',
    test: 'natural'
  }),
  new BenchmarkTest({
    name: 'String (valid)',
    dataType: 'string',
    test: 'hello'
  }),
  new BenchmarkTest({
    name: 'String (invalid)',
    dataType: 'string',
    test: 10
  }),
  new BenchmarkTest({
    name: 'Function (valid)',
    dataType: 'function',
    test: () => {}
  }),
  new BenchmarkTest({
    name: 'Function (invalid)',
    dataType: 'function',
    test: 'function'
  }),
  new BenchmarkTest({
    name: 'Object (valid)',
    dataType: 'object',
    test: {}
  }),
  new BenchmarkTest({
    name: 'Object (invalid)',
    dataType: 'object',
    test: 'object'
  }),
  new BenchmarkTest({
    name: 'Array (valid)',
    dataType: 'array',
    test: []
  }),
  new BenchmarkTest({
    name: 'Array (invalid)',
    dataType: 'array',
    test: 'array'
  })
];

module.exports = {
  tests,
  BenchmarkTest
};
