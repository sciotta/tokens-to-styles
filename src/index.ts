const beautify = require('js-beautify').css;

interface Options {
  pretty?: boolean;
  unit?: string;
}

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
  const sanitizedKey = sanitizeKey(key);
  const unit = options.unit || 'px';
  const formattedValue = formatValue(value, unit);
  return `--${prefix}${sanitizedKey}: ${formattedValue};\n`;
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

  return formatCssWithPrettier(output);
}
