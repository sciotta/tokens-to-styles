import { TokensConverter } from '.';

describe('toCssVariables function', () => {
  test('should generate CSS variables', () => {
    const tokensObj = {
      fontSize: 16,
      color: 'red',
    };

    const options = {
      pretty: false,
      unit: 'px',
    };

    const tokensConverter = new TokensConverter(options);
    const result = tokensConverter.toCssVariables(tokensObj);
    const expectedOutput = `:root {\n  --font-size: 16px;\n  --color: red;\n}`;

    expect(result).toBe(expectedOutput);
  });

  test('should generate nested CSS variables', () => {
    const tokensObj = {
      spacing: {
        small: 8,
        medium: 16,
      },
    };

    const options = {
      pretty: false,
      unit: 'px',
    };

    const tokensConverter = new TokensConverter(options);
    const result = tokensConverter.toCssVariables(tokensObj);
    const expectedOutput = `:root {\n  /* spacing */\n  --spacing-small: 8px;\n  --spacing-medium: 16px;\n}`;

    expect(result).toBe(expectedOutput);
  });

  test('should sanitize when attribute uses a dot character', () => {
    const tokensObj = {
      'font-size': 16,
    };

    const options = {
      pretty: false,
      unit: 'px',
    };

    const tokensConverter = new TokensConverter(options);
    const result = tokensConverter.toCssVariables(tokensObj);
    const expectedOutput = `:root {\n  --font-size: 16px;\n}`;

    expect(result).toBe(expectedOutput);
  });

  test('should transform CSS variable names', () => {
    const tokensObj = {
      fontSize: 16,
    };

    const options = {
      pretty: false,
      unit: 'px',
      transform: (key: string, value: string) => {
        return {
          key: `${key}abc`,
          value,
        };
      },
    };

    const tokensConverter = new TokensConverter(options);
    const result = tokensConverter.toCssVariables(tokensObj);
    const expectedOutput = `:root {\n  --font-sizeabc: 16px;\n}`;

    expect(result).toBe(expectedOutput);
  });
});
