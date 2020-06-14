import { toKebabCase } from './utils';

interface BenchmarkTestConfig {
  name: string;
  dataType: string;
  test: unknown;
}

export class BenchmarkTest {
  name: string;
  dataType: string;
  test: unknown;
  key: string;

  constructor(config: BenchmarkTestConfig) {
    this.name = config.name;
    this.dataType = config.dataType;
    this.test = config.test;
    this.key = toKebabCase(this.name);
  }
}

export const tests = [
  new BenchmarkTest({
    dataType: 'undefined',
    name: 'Undefined (valid)',
    test: undefined
  }),
  new BenchmarkTest({
    dataType: 'undefined',
    name: 'Undefined (invalid)',
    test: 'undefined'
  }),
  new BenchmarkTest({
    dataType: 'null',
    name: 'Null (valid)',
    test: null
  }),
  new BenchmarkTest({
    dataType: 'null',
    name: 'Null (invalid)',
    test: 'null'
  }),
  new BenchmarkTest({
    dataType: 'boolean',
    name: 'Boolean (valid)',
    test: true
  }),
  new BenchmarkTest({
    dataType: 'boolean',
    name: 'Boolean (invalid)',
    test: 'boolean'
  }),
  new BenchmarkTest({
    dataType: 'number',
    name: 'Number (valid)',
    test: 10
  }),
  new BenchmarkTest({
    dataType: 'number',
    name: 'Number (invalid)',
    test: 'number'
  }),
  new BenchmarkTest({
    dataType: 'integer',
    name: 'Integer (valid)',
    test: 10
  }),
  new BenchmarkTest({
    dataType: 'integer',
    name: 'Integer (invalid)',
    test: 'integer'
  }),
  new BenchmarkTest({
    dataType: 'natural',
    name: 'Natural (valid)',
    test: 10
  }),
  new BenchmarkTest({
    dataType: 'natural',
    name: 'Natural (invalid)',
    test: 'natural'
  }),
  new BenchmarkTest({
    dataType: 'string',
    name: 'String (valid)',
    test: 'hello'
  }),
  new BenchmarkTest({
    dataType: 'string',
    name: 'String (invalid)',
    test: 10
  }),
  new BenchmarkTest({
    dataType: 'function',
    name: 'Function (valid)',
    test: Function()
  }),
  new BenchmarkTest({
    dataType: 'function',
    name: 'Function (invalid)',
    test: 'function'
  }),
  new BenchmarkTest({
    dataType: 'object',
    name: 'Object (valid)',
    test: {}
  }),
  new BenchmarkTest({
    dataType: 'object',
    name: 'Object (invalid)',
    test: 'object'
  }),
  new BenchmarkTest({
    dataType: 'array',
    name: 'Array (valid)',
    test: []
  }),
  new BenchmarkTest({
    dataType: 'array',
    name: 'Array (invalid)',
    test: 'array'
  })
];
