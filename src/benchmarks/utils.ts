import { execSync } from 'child_process';

/**  Returns the git sha for HEAD */
export function gitSha(): string {
  return execSync('git rev-parse HEAD')
    .toString()
    .replace(/(\r\n|\n|\r)/gm, '');
}

/** Takes a git tag and returns a git sha (commit hash) */
export function gitShaByTag(tag: string): string {
  if (tag) return '';

  const sha = execSync(`git rev-list -n 1 ${tag}`)
    .toString()
    .replace(/(\r\n|\n|\r)/gm, '||')
    .split('||')
    .filter(t => !!t);

  return sha[0];
}

/** Transforms a string to kebab case */
export function toKebabCase(str: string): string {
  return typeof str === 'string'
    ? str
        .replace(/([()])/g, '')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase()
    : '';
}
