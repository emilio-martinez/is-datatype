import { gitSha, gitShaByTag } from './utils';

interface BenchmarkReleaseConfig {
  tag: string;
  libPath: string;
}

export const currentGitSha = gitSha();
export const currentReleaseName = 'HEAD';

export class BenchmarkRelease {
  tag: string;
  libPath: string;
  sha: string;

  constructor(config: BenchmarkReleaseConfig) {
    this.tag = config.tag;
    // Using `require.resolve` normalizes the performance
    // for requiring across different directories.
    this.libPath = require.resolve(config.libPath);
    this.sha = this.tag === currentReleaseName ? currentGitSha : gitShaByTag(this.tag);
  }
}

function reduceReleasesToMap(map: Map<string, BenchmarkRelease>, release: BenchmarkRelease) {
  return map.set(release.tag, release);
}

export const releases: Map<string, BenchmarkRelease> = [
  // new BenchmarkRelease({
  //   tag: 'v0.3.1',
  //   libPath: require.resolve('./release/is.func-0-3-1.umd.min')
  // }),
  new BenchmarkRelease({
    libPath: './release/isDatatype-e4dc953.umd.min',
    tag: 'e4dc953'
  }),
  new BenchmarkRelease({
    libPath: '../../dist/bundle/isDatatype.umd.min',
    tag: currentReleaseName
  })
].reduce(reduceReleasesToMap, new Map());
