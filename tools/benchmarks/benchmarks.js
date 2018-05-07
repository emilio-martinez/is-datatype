// @ts-check

/**
 * @typedef {Object} IsDataTypeRelease
 * @property {any} is
 * @property {any} DataType
 */

/**
 * @typedef BenchmarkCycleEvent
 * @property {string} timeStamp
 * @property {{ name: string; hz: string; stats: { rme: string } }} target
 */

const Benchmark = require('benchmark');
const chalk = require('chalk').default;
const { currentReleaseName, BenchmarkRelease } = require('./releases');
const { BenchmarkTest } = require('./tests');

/**
 * A consolidated result record
 * @class BenchmarkResultRecord
 */
class BenchmarkResultRecord {
  /**
   * Creates an instance of BenchmarkResultRecord.
   * @param {BenchmarkRelease} release
   * @param {BenchmarkTest} test
   * @param {BenchmarkCycleEvent} benchmarkEvent
   */
  constructor(release, test, benchmarkEvent) {
    this.sha = release.sha;
    this.tag = release.tag;
    this.name = test.name;
    this.key = test.key;
    this.timeStamp = benchmarkEvent.timeStamp;
    this.stats = {
      rme: benchmarkEvent.target.stats.rme,
      hz: benchmarkEvent.target.hz
    };
  }
}

/**
 * A record tha reflects a single test case matched to multiple releases
 * @class BenchmarkTestCases
 */
class BenchmarkTestCases {
  /**
   * Creates an instance of BenchmarkTestCases.
   * @param {BenchmarkTest} test
   * @param {Map<string, BenchmarkRelease>} releases
   */
  constructor(test, releases) {
    this.test = test;
    this.releases = releases;

    /** @type BenchmarkCycleEvent[] */
    this.results = [];

    this.suite = new Benchmark.Suite(test.key, {
      onStart: () => this._onSuiteStart(),
      onCycle: (event) => this._onSuiteCycle(event),
      onComplete: () => this._onSuiteComplete()
    });

    for (let [name, release] of this.releases) {
      this.suite.add({
        name,
        fn: () => this._onSuiteTestCall(release),
        minSamples: 120
      });
    }
  }

  /**
   * @param {BenchmarkRelease} release
   */
  _onSuiteTestCall(release) {
    // Requiring on every test reduces cycle performance but it helps
    // minimize engine optimizations which skew benchmark results
    const { is, DataType } = require(release.libPath);
    is(this.test.test, DataType[this.test.dataType]);
  }

  /** Ensures no results */
  _onSuiteStart() {
    this.results = [];
  }

  /** Prints results */
  _onSuiteComplete() {
    this._printFastest();
  }

  /**
   * Saves and prints cycle results
   * @param {BenchmarkCycleEvent} event
   */
  _onSuiteCycle(event) {
    this.results = this.results.concat(event);
    this._print(String(event.target));
  }

  /** Runs the declared benchmarks. */
  run() {
    this.suite.reset();
    this.suite.run();
  }

  /**
   * Converts set result data into result records
   * @returns {BenchmarkResultRecord[]}
   */
  getResultRecords() {
    return this.results.map(res => {
      const releaseName = res.target.name;
      const release = this.releases.get(releaseName);

      return new BenchmarkResultRecord(release, this.test, res);
    });
  }

  /** Gets the fastest run's name */
  _getFastest() {
    return this.suite.filter('fastest').map(s => s.name);
  }

  /** Returns a percentage-based increase/decrease in performance */
  _getFastestDiff() {
    const benchmarks = this.suite.map(s => ({
      name: s.name,
      hz: s.hz
    }));
    const fastest = this._getFastest();

    let fast = 0;
    let rest = 0;

    benchmarks.forEach(b => {
      if (fastest.indexOf(b.name) !== -1) {
        fast += parseInt(b.hz, 10);
      } else {
        rest += parseInt(b.hz, 10);
      }
    });

    let avg = fast / (+rest / (benchmarks.length - 1)) * 1000;
    avg = parseFloat(avg.toFixed()) / 1000;
    return avg;
  }

  /** Prints a message stating the fastest run for this tests */
  _printFastest() {
    const fastest = this._getFastest();
    const color =
      fastest.length > 1 ? chalk.yellow : fastest.indexOf(currentReleaseName) >= 0 ? chalk.green : chalk.red;

    const fastestName = fastest.join("' & '");
    const msg = `Fastest is '${fastestName}' (${this._getFastestDiff()}x)\r\n`;

    this._print(color(msg));
  }

  /**
   * Print a message namespaces with the test key
   * @param {string} msg
   */
  _print(msg) {
    console.log(chalk.cyan(`[${this.test.key}]`) + ` ${msg}`);
  }
}

module.exports = {
  BenchmarkTestCases,
  BenchmarkResultRecord
};