// @ts-check

/**
 * @typedef {Object} BenchmarkReleaseConfig
 * @property {string} tag - Git tag marking a release
 * @property {string} libPath - library path
 */

const { gitSha, gitShaByTag } = require('../utils/git');

const currentGitSha = gitSha();
const currentReleaseName = 'HEAD';

class BenchmarkRelease {
  /**
   * Creates an instance of BenchmarkRelease.
   * @param {BenchmarkReleaseConfig} config
   */
  constructor(config) {
    this.tag = config.tag;
    // Using `require.resolve` normalizes the performance
    // for requiring across different directories.
    this.libPath = require.resolve(config.libPath);
    this.sha = this.tag === currentReleaseName ? currentGitSha : gitShaByTag(this.tag);
  }
}

/**
 * @param {Map<string, BenchmarkRelease>} map Current map of releases
 * @param {BenchmarkRelease} release
 * @returns {Map<string, BenchmarkRelease>} Map of releases
 */
const reduceReleasesToMap = (map, release) => map.set(release.tag, release);

/**
 * @type {Map<string, BenchmarkRelease>} Map of releases
 */
const releases = [
  // new BenchmarkRelease({
  //   tag: 'v0.3.1',
  //   libPath: require.resolve('./release/is.func-0-3-1.umd.min')
  // }),
  new BenchmarkRelease({
    tag: 'e4dc953',
    libPath: './release/isDatatype-e4dc953.umd.min'
  }),
  new BenchmarkRelease({
    tag: currentReleaseName,
    libPath: '../../dist/bundle/isDatatype.umd.min'
  })
].reduce(reduceReleasesToMap, new Map());

module.exports = {
  releases,
  currentReleaseName,
  BenchmarkRelease
};