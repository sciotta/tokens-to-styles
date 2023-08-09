const beautify = require('js-beautify').css;

interface Options {
  pretty?: boolean;
  unit?: string;
}

function formatValue(value: any, unit: string): string {
  return !isNaN(value) && value !== 0 ? `${value}${unit}` : value;
}

function formatVariable(
  key: string,
  value: any,
  prefix: string,
  options: Options
): string {
  const unit = options.unit || 'px';
  const formattedValue = formatValue(value, unit);
  return `--${prefix}${key}: ${formattedValue};\n`;
}

function formatCategoryComment(key: string, output: string): string {
  return output ? `\n/* ------------------------- */\n\n/* ${key} */\n` : `\n/* ${key} */\n`;
}

export function tokensToCssModule(
  tokensObj: Record<string, any>,
  options: Options = {},
  prefix = ''
): string {
  let output = '';

  for (const key in tokensObj) {
    if (tokensObj.hasOwnProperty(key)) {
      const value = tokensObj[key];
      const valueType = typeof value;

      if (valueType === 'object') {
        output += formatCategoryComment(key, output);
        output += tokensToCssModule(value, options, `${prefix}${key}-`);
      } else {
        output += formatVariable(key, value, prefix, options);
      }
    }
  }

  if (prefix === '') {
    output = `:root {${options.pretty ? '\n' : ''}${output}${
      options.pretty ? '\n' : ''
    }}`;
  }

  return output;
}

export async function formatCssWithPrettier(css: string): Promise<string> {
  try {
    const formattedCss = await beautify(css);
    return formattedCss;
  } catch (error) {
    console.error('Error formatting CSS:', error);
    return css;
  }
}