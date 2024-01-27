import { Options } from "./types";

const beautify = require('js-beautify').css;

function formatValue(value: any, unit: string): string {
  return !isNaN(value) && value !== 0 ? `${value}${unit}` : value;
}

function sanitizeKey(key: string): string {
  key = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

  let sanitizedKey = key.replace(/\./g, '-');
  sanitizedKey = sanitizedKey.replace(/[^a-zA-Z0-9-_]/g, '');
  if (/^\d/.test(sanitizedKey)) {
    sanitizedKey = `_${sanitizedKey}`;
  }
  return sanitizedKey;
}

function formatVariable(
  key: string,
  value: any,
  prefix: string,
  options: Options
): string {
  const sanitizedKey = sanitizeKey(`${prefix}${key}`);
  const unit = options.unit ?? 'px';
  let finalkey = sanitizedKey;
  let finalValue = formatValue(value, unit);

  if (options.transform) {
    const result = options.transform(finalkey, finalValue);
    if (result === null) {
      return '';
    }
    finalkey = result.key;
    finalValue = result.value;
  }

  return `--${finalkey}: ${finalValue};\n`;
}

function formatCategoryComment(key: string, output: string): string {
  return output ? `\n/* ------------------------- */\n\n/* ${key} */\n` : `\n/* ${key} */\n`;
}

function formatCssWithPrettier(css: string): string {
  try {
    const formattedCss =  beautify(css, {
      indent_size: 2,
      indent_char: ' ',
    });
    return formattedCss;
  } catch (error) {
    console.error('Error formatting CSS:', error);
    return css;
  }
}

function processObjectValue(params : { key: string, value: any, options: Options, prefix: string, output: string }): string {
  params.output = formatCategoryComment(params.key, params.output);
  return params.output + tokensToCssModule(params.value, params.options, `${params.prefix}${params.key}-`);
}

function processNonObjectValue(key: string, value: any, prefix: string, options: Options): string {
  return formatVariable(key, value, prefix, options);
}

function processKey(key: string, tokensObj: Record<string, any>, options: Options, prefix: string, output: string): string {
  const value = tokensObj[key];
  const valueType = typeof value;

  return valueType === 'object' 
    ? processObjectValue({ key, value, options, prefix, output}) 
    : processNonObjectValue(key, value, prefix, options);
}

function processKeys(tokensObj: Record<string, any>, options: Options, prefix: string): string {
  let output = '';
  for (const key in tokensObj) {
    if (tokensObj.hasOwnProperty(key)) {
      output += processKey(key, tokensObj, options, prefix, output);
    }
  }
  return output;
}

/**
 * @param options - This is an optional object that can be used to customize the output
 */
export function tokensToCssModule(
/**
 * The object (key and value) containing the tokens
 * @example
 * ```ts
 * const tokensObj = {
  colors: {
    primary: '#000',
    secondary: '#fff',
  },
  fontSizes: {
    small: '12px',
    medium: '16px',
    large: '20px',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
};
```
*/
  tokensObj: Record<string, any>,
  options: Options = {},
  /** @ignore */
  prefix = ''
): string {
  let output = processKeys(tokensObj, options, prefix);

  if (prefix === '') {
    output = `:root {${output}}`;
  }

  return formatCssWithPrettier(output);
}
