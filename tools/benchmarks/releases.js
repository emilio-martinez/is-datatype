// @ts-check

const { gitSha, gitTagsBySha } = require('../utils/git');

const currentGitSha = gitSha();
const currentReleaseName = 'HEAD';

const releases = [
  {
    name: 'v0.3.1',
    sha: 'c6da5dc7afcfbd790103099f1fcd9aeeb962093d',
    lib: require('./is.func-0-3-1.umd.min')
  },
  {
    name: 'HEAD',
    sha: currentGitSha,
    lib: require('../../dist/bundle/isDatatype.umd.min')
  }
].map(r => Object.assign({}, r, { tags: gitTagsBySha(r.sha) }));

module.exports = {
  releases,
  currentReleaseName
};
