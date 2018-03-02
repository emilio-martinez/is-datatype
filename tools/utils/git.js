// @ts-check

const execSync = require('child_process').execSync;

/**
 * Returns the git sha for HEAD
 * @returns {string}
 */
function gitSha() {
  return execSync('git rev-parse HEAD')
    .toString()
    .replace(/(\r\n|\n|\r)/gm, '');
}

/**
 * Takes a git tag and returns a git sha (commit hash)
 * @param {string} tag
 * @returns {string}
 */
function gitShaByTag(tag) {
  if (!tag) return '';

  const sha = execSync(`git rev-list -n 1 ${tag}`)
    .toString()
    .replace(/(\r\n|\n|\r)/gm, '||')
    .split('||')
    .filter(t => !!t);

  return sha[0];
}

module.exports = {
  gitSha,
  gitShaByTag
};
