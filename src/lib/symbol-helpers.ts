/**
 * Because polyfills can't add new primitives, often they'll end up with a
 * `typeof val === 'object'` situation, as is the case with Symbol polyfills.
 * This does some extra checks to prove the likelihood of a value being a symbol,
 * namely check the constructor name and whether the static `iterator` is present.
 */
export function likelySymbol({ constructor }: symbol | object) {
  return constructor && constructor.name === 'Symbol' && 'iterator' in constructor;
}
