// @ts-check

const { releases } = require('./releases');
const { tests } = require('./tests');
const { BenchmarkTestCases } = require('./benchmarks');

console.log('\r\nStarting to run tests...\r\n');
tests.forEach(t => new BenchmarkTestCases(t, releases).run())
