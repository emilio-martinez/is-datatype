// tslint:disable no-console

import { releases } from './releases';
import { tests } from './tests';
import { BenchmarkTestCases } from './benchmarks';

console.log('\r\nStarting to run tests...\r\n');
tests.forEach(t => new BenchmarkTestCases(t, releases).run());
