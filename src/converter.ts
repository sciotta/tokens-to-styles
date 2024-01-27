import { Options } from "./types";
const beautify = require('js-beautify').css;

/**
 * This class is used to convert a tokens object into CSS variables.
 *
*/
export class TokensConverter {
  private options: Options;

  /**
  * @param options - This is an optional object that can be used to customize the output
  * @example
  * ```ts
  * const options = {
  *   unit: 'px',
  *   transform: (key, value) => {
    *   // Skip tokens with unknown CSS properties
    *   if (key.includes('unknown-css-property')) {
    *     return null;
    *   }
    * 
    *   // Change the value of all font-family tokens to Roboto
    *   if (key.includes('font-family')) {
    *     return { key, value: 'Roboto' };
    *   }
    * 
    *   // Return the original token
    *   return { key, value };
  *   },
  * };
  * 
  * const tokensConverter = new TokensConverter(options);
  * const result = tokensConverter.toCssVariables(tokensObj);
  * ```
  */
  constructor(options: Options = {}) {
    this.options = options;
  }

  private formatValue(value: any, unit: string): string {
    return !isNaN(value) && value !== 0 ? `${value}${unit}` : value;
  }

  private sanitizeKey(key: string): string {
    key = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    let sanitizedKey = key.replace(/\./g, '-');
    sanitizedKey = sanitizedKey.replace(/[^a-zA-Z0-9-_]/g, '');
    if (/^\d/.test(sanitizedKey)) {
      sanitizedKey = `_${sanitizedKey}`;
    }
    return sanitizedKey;
  }

  private formatVariable(key: string, value: any, prefix: string): string {
    const sanitizedKey = this.sanitizeKey(`${prefix}${key}`);
    const unit = this.options.unit || 'px';
    let finalKey = sanitizedKey;
    let finalValue = this.formatValue(value, unit);

    if (this.options.transform) {
      const result = this.options.transform(finalKey, finalValue);
      if (result === null) {
        return '';
      }
      finalKey = result.key;
      finalValue = result.value;
    }

    return `--${finalKey}: ${finalValue};\n`;
  }

  private formatCategoryComment(key: string, output: string): string {
    return output ? `\n/* ------------------------- */\n\n/* ${key} */\n` : `\n/* ${key} */\n`;
  }

  private formatCssWithPrettier(css: string): string {
    try {
      const formattedCss = beautify(css, {
        indent_size: 2,
        indent_char: ' ',
      });
      return formattedCss;
    } catch (error) {
      console.error('Error formatting CSS:', error);
      return css;
    }
  }

  private processObjectValue(key: string, value: any, prefix: string, output: string): string {
    output = this.formatCategoryComment(key, output);
    return output + this.tokensToCssModule(value, `${prefix}${key}-`);
  }

  private processNonObjectValue(key: string, value: any, prefix: string): string {
    return this.formatVariable(key, value, prefix);
  }

  private processKey(key: string, tokensObj: Record<string, any>, prefix: string, output: string): string {
    const value = tokensObj[key];
    const valueType = typeof value;

    return valueType === 'object' ?
      this.processObjectValue(key, value, prefix, output) :
      this.processNonObjectValue(key, value, prefix);
  }

  private processKeys(tokensObj: Record<string, any>, prefix: string): string {
    let output = '';
    for (const key in tokensObj) {
      if (tokensObj.hasOwnProperty(key)) {
        output += this.processKey(key, tokensObj, prefix, output);
      }
    }
    return output;
  }

  private tokensToCssModule(tokensObj: Record<string, any>, prefix: string = ''): string {
    let output = this.processKeys(tokensObj, prefix);

    if (prefix === '') {
      output = `:root {${output}}`;
    }

    return this.formatCssWithPrettier(output);
  }


  public toCssVariables(
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
    tokensObj: Record<string, any>
  ): string {
    return this.tokensToCssModule(tokensObj);
  }
}
