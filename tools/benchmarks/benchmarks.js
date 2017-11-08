const Benchmark = require('benchmark');
const chalk = require('chalk')

function benchmark (version, older, newer) {
  const OLD = { is: older.is, DataType: older.DataType }
  const NEW = { is: newer.is, DataType: newer.DataType }
  const OLD_VERSION = `${version}`;
  const NEW_VERSION = 'latest';

  const setupTest = (name, type, val) => {
    return () => {
      const suite = new Benchmark.Suite(`${name}`);
      suite
        .add(OLD_VERSION, function () { OLD.is(val, OLD.DataType[type]) })
        .add(NEW_VERSION, function () { NEW.is(val, NEW.DataType[type]) })
      return suite;
    }
  }

  const TESTS = [
    setupTest('Any', 'any', {}),
    setupTest('Undefined (valid)', 'undefined', undefined),
    setupTest('Undefined (invalid)', 'undefined', 'undefined'),
    setupTest('Boolean (valid)', 'boolean', true),
    setupTest('Boolean (invalid)', 'boolean', 'boolean'),
    setupTest('Number (valid)', 'number', 10),
    setupTest('Number (invalid)', 'number', 'number'),
    setupTest('Integer (valid)', 'integer', 10),
    setupTest('Integer (invalid)', 'integer', 'integer'),
    setupTest('Natural (valid)', 'natural', 10),
    setupTest('Natural (invalid)', 'natural', 'natural'),
    setupTest('String (valid)', 'string', 'hello'),
    setupTest('String (invalid)', 'string', 10),
    setupTest('Function (valid)', 'function', () => {}),
    setupTest('Function (invalid)', 'function', 'function'),
    setupTest('Object (valid)', 'object', {}),
    setupTest('Object (invalid)', 'object', 'object'),
    setupTest('Array (valid)', 'array', []),
    setupTest('Array (invalid)', 'array', 'array')
  ]

  function runTest (test, i, tests) {
    const last = i !== tests.length - 1;
    const suite = test();
    return suite
      .on('cycle', function (event) { console.log(`[${this.name}] ${String(event.target)}`) })
      .on('complete', function () {
        const fastest = this.filter('fastest').map('name');
        const color = fastest.length > 1 ? chalk.yellow : fastest.indexOf(NEW_VERSION) >=0 ? chalk.green : chalk.red;
        console.log(color(`[${this.name}] Fastest is '${fastest.join("' & '")}'`))
        console.log('')
      })
      .run()
  }

  function printSingleSummary (suites, version) {
    const color = version === (NEW_VERSION) ? chalk.green : chalk.red;
    const winners = suites.filter(suite => suite.filter('fastest').map('name').indexOf(version) >= 0).map(s => s.name)
    console.log(color(`'${version}' is faster for '${winners.join("', '")}'`))
  }

  /** Execute tests */
  const SUITES = TESTS.map(runTest)
  /** Print Summaries */
  // printSingleSummary(SUITES, OLD_VERSION)
  // printSingleSummary(SUITES, NEW_VERSION)
}

benchmark('v0.3.1', require('./is.func-0-3-1.umd.min'), require('../../dist/bundle/isDatatype.umd.min'))