// @ts-check

const { releases } = require('./releases');
const { tests } = require('./tests');
const { BenchmarkTestCases } = require('./benchmarks');

console.log('\r\nStarting to run tests...\r\n');
tests.map(t => new BenchmarkTestCases(t, releases)).forEach(t => t.run());
