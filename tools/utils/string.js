 // @ts-check

function toKebabCase (str) {
  return typeof str === 'string'
    ? str.replace(/([\(\)])/g, '')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase()
    : '';
}

module.exports = {
  toKebabCase
}
