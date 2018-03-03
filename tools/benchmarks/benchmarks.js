// @ts-check

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
   * @param {BenchmarkRelease[]} releases
   */
  constructor(test, releases) {
    this.test = test;
    this.releases = this._releasesAsMap(releases);

    /** @type BenchmarkCycleEvent[] */
    this.results = [];

    this.suite = new Benchmark.Suite(test.key);

    for (let [name, release] of this.releases) {
      this.suite.add(
        release.tag,
        function() {
          release.lib.is(test.test, release.lib.DataType[test.dataType]);
        },
        { minSamples: 200 }
      );
    }
  }

  /** Runs the declared benchmarks. After running, the results property will be populated. */
  run() {
    const results = [];

    this.suite
      .on('cycle', event => {
        results.push(event);
        this._print(String(event.target));
      })
      .on('complete', () => {
        this.results = results;
        this._printFastest();
      })
      .run();
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
    const benchmarks = this.suite.map(({ name, hz }) => ({ name, hz }));
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

    let avg = fast / (+rest / (benchmarks.length - 1)) * 100;
    avg = parseFloat(avg.toFixed());
    return `${Benchmark.formatNumber(avg)}%`;
  }

  /** Prints a message stating the fastest run for this tests */
  _printFastest() {
    const fastest = this._getFastest();
    const color =
      fastest.length > 1 ? chalk.yellow : fastest.indexOf(currentReleaseName) >= 0 ? chalk.green : chalk.red;

    const msg = `Fastest is '${fastest.join("' & '")}' (${this._getFastestDiff()})\r\n`;

    this._print(color(msg));
  }

  /**
   * Print a message namespaces with the test key
   * @param {string} msg
   */
  _print(msg) {
    console.log(chalk.cyan(`[${this.test.key}]`) + ` ${msg}`);
  }

  /**
   * Converts releases intro an ES2015 Map
   * @param {BenchmarkRelease[]} releases
   * @returns {Map<string, BenchmarkRelease>}
   */
  _releasesAsMap(releases) {
    /** @type Map<string, BenchmarkRelease> */
    const map = new Map();
    releases.forEach(r => map.set(r.tag, r));
    return map;
  }
}

module.exports = {
  BenchmarkTestCases,
  BenchmarkResultRecord
};
