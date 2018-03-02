// @ts-check

/**
 * @typedef {Object} IsDataTypeRelease
 * @property {any} is
 * @property {any} DataType
 */

/**
 * @typedef {Object} BenchmarkReleaseConfig
 * @property {string} tag - Git tag marking a release
 * @property {IsDataTypeRelease} lib - isDataType release
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
    this.lib = config.lib;
    this.sha = this.tag === currentReleaseName ? currentGitSha : gitShaByTag(this.tag);
  }
}

const releases = [
  new BenchmarkRelease({
    tag: 'v0.3.1',
    lib: require('./is.func-0-3-1.umd.min')
  }),
  new BenchmarkRelease({
    tag: currentReleaseName,
    lib: require('../../dist/bundle/isDatatype.umd.min')
  })
];

module.exports = {
  releases,
  currentReleaseName,
  BenchmarkRelease
};
