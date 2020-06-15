/* eslint-disable @typescript-eslint/no-explicit-any */

import { BenchmarkRelease, currentReleaseName } from './releases';
import { BenchmarkTest } from './tests';
import { Suite } from 'benchmark';
import kleur from 'kleur';

interface IsDataTypeRelease {
  is: any;
  DataType: any;
}

interface BenchmarkCycleEvent {
  timeStamp: string;
  target: { name: string; hz: string; stats: { rme: string } };
}

/** A consolidated result record */
export class BenchmarkResultRecord {
  sha: string;
  tag: string;
  name: string;
  key: string;
  timeStamp: string;
  stats: {
    hz: string;
    rme: string;
  };

  constructor(release: BenchmarkRelease, test: BenchmarkTest, benchmarkEvent: BenchmarkCycleEvent) {
    this.sha = release.sha;
    this.tag = release.tag;
    this.name = test.name;
    this.key = test.key;
    this.timeStamp = benchmarkEvent.timeStamp;
    this.stats = {
      hz: benchmarkEvent.target.hz,
      rme: benchmarkEvent.target.stats.rme,
    };
  }
}

/**  A record tha reflects a single test case matched to multiple releases */
export class BenchmarkTestCases {
  results: BenchmarkCycleEvent[] = [];
  suite: Suite;

  constructor(public test: BenchmarkTest, public releases: Map<string, BenchmarkRelease>) {
    this.suite = new Suite(test.key, {
      onStart: () => this._onSuiteStart(),
      onCycle: (event: BenchmarkCycleEvent) => this._onSuiteCycle(event),
      onComplete: () => this._onSuiteComplete(),
    });

    for (const [name, release] of this.releases) {
      this.suite.add({
        name,
        fn: () => this._onSuiteTestCall(release),
        minSamples: 120,
      });
    }
  }

  private _onSuiteTestCall(release: BenchmarkRelease): void {
    // Requiring on every test reduces cycle performance but it helps
    // minimize engine optimizations which skew benchmark results
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { is, DataType } = require(release.libPath) as IsDataTypeRelease;
    is(this.test.test, DataType[this.test.dataType]);
  }

  /** Ensures no results */
  private _onSuiteStart(): void {
    this.results = [];
  }

  /** Prints results */
  private _onSuiteComplete(): void {
    this._printFastest();
  }

  /**  Saves and prints cycle results */
  private _onSuiteCycle(event: BenchmarkCycleEvent): void {
    this.results = this.results.concat(event);
    this._print(String(event.target));
  }

  /** Runs the declared benchmarks. */
  run(): void {
    this.suite.reset();
    this.suite.run();
  }

  getResultRecords(): BenchmarkResultRecord[] {
    return this.results.map((res) => {
      const releaseName = res.target.name;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const release = this.releases.get(releaseName)!;

      return new BenchmarkResultRecord(release, this.test, res);
    });
  }

  /** Gets the fastest run's name */
  _getFastest(): string[] {
    return this.suite.filter('fastest').map((s: any) => s.name);
  }

  /** Returns a percentage-based increase/decrease in performance */
  _getFastestDiff(): number {
    const benchmarks = this.suite.map((s: any) => ({
      name: s.name,
      hz: s.hz,
    }));
    const fastest = this._getFastest();

    let fast = 0;
    let rest = 0;

    benchmarks.forEach((b) => {
      if (fastest.indexOf(b.name) !== -1) {
        fast += parseInt(b.hz, 10);
      } else {
        rest += parseInt(b.hz, 10);
      }
    });

    let avg = (fast / (+rest / (benchmarks.length - 1))) * 1000;
    avg = parseFloat(avg.toFixed()) / 1000;
    return avg;
  }

  /** Prints a message stating the fastest run for this tests */
  _printFastest(): void {
    const fastest = this._getFastest();
    const color =
      fastest.length > 1
        ? kleur.yellow
        : fastest.indexOf(currentReleaseName) >= 0
        ? kleur.green
        : kleur.red;

    const fastestName = fastest.join("' & '");
    const msg = `Fastest is '${fastestName}' (${this._getFastestDiff()}x)\r\n`;

    this._print(color(msg));
  }

  /**  Print a message namespaces with the test key */
  _print(msg: string): void {
    console.log(kleur.cyan(`[${this.test.key}]`) + ` ${msg}`);
  }
}
