 // @ts-check

const execSync = require('child_process').execSync;

function gitSha () {
  return execSync('git rev-parse HEAD')
    .toString()
    .replace(/(\r\n|\n|\r)/gm, '');
}

function gitTagsBySha (sha) {
  if (!sha) return [];

  const gitTags = execSync(`git tag --list --contains ${sha}`)
    .toString()
    .replace(/(\r\n|\n|\r)/gm, '||')
    .split('||')
    .filter(t => !!t);

  return [...new Set(gitTags)];
}

module.exports = {
  gitSha,
  gitTagsBySha
}
