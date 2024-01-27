export type TransformFunction = (key: string, value: any) => { key: string; value: any } | null;

export interface Options {
  unit?: string;
/**
 * This function is called for each token. It can be used to transform
 * the key and value of each token. If the function returns null, the
 * token will be skipped.
 *
 * @example
 * ```ts
 transform: (key, value) => {
  // Skip tokens with unknown CSS properties
  if (key.includes('unknown-css-property')) {
    return null;
  }

  // Change the value of all font-family tokens to Roboto
  if (key.includes('font-family')) {
    return { key, value: 'Roboto' };
  }

  // Return the original token
  return { key, value };
},
 * ```
 */
  transform?: TransformFunction;
}
