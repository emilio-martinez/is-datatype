// @ts-check

const Benchmark = require('benchmark');
const chalk = require('chalk');

const { releases, currentReleaseName } = require('./releases');
const { tests } = require('./tests');

class BenchmarkTestCases {
  constructor(test, releases) {
    this.test = test;
    this.releases = this._releasesAsMap(releases);
    this.results = [];

    this.suite = new Benchmark.Suite(test.key);

    for (let [name, release] of this.releases) {
      this.suite.add(
        release.name,
        function() {
          release.lib.is(test.test, release.lib.DataType[test.dataType]);
        },
        { minSamples: 200 }
      );
    }
  }

  /** Runs the declared benchmarks */
  run() {
    const { key, name } = this.test;
    const results = [];
    const suite = this.suite;

    suite
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

  /** Converts set result data into result records */
  getResultRecords() {
    const resultRecords = [];

    return this.results.map(res => {
      const releaseName = res.target.name;
      const release = this.releases.get(releaseName);

      return {
        sha: release.sha,
        tags: release.tags,
        name: this.test.name,
        key: this.test.key,
        timeStamp: res.timeStamp,
        stats: {
          rme: res.target.stats.rme,
          hz: res.target.hz
        }
      };
    });
  }

  /** Gets the fastest run's name */
  _getFastest() {
    return this.suite.filter('fastest').map('name');
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

    var avg = fast / (+rest / (benchmarks.length - 1)) * 100;
    return `${Benchmark.formatNumber(avg.toFixed())}%`;
  }

  /** Prints a message stating the fastest run for this tests */
  _printFastest() {
    const fastest = this._getFastest();
    const color =
      fastest.length > 1 ? chalk.yellow : fastest.indexOf(currentReleaseName) >= 0 ? chalk.green : chalk.red;

    const msg = `Fastest is '${fastest.join("' & '")}' (${this._getFastestDiff()})\r\n`;

    this._print(color(msg));
  }

  /** Print a message namespaces with the test key */
  _print(msg) {
    console.log(`[${this.test.key}] ${msg}`);
  }

  /** Converts releases intro an ES2015 Map */
  _releasesAsMap(releases) {
    const map = new Map();
    releases.forEach(r => map.set(r.name, r));
    return map;
  }
}

// RUN
tests.map(t => new BenchmarkTestCases(t, releases)).forEach(t => t.run());
