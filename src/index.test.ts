import { tokensToCssModule } from './index';

describe('tokensToCssModule function', () => {
  test('should generate CSS variables', () => {
    const tokensObj = {
      fontSize: 16,
      color: 'red',
    };

    const options = {
      pretty: false,
      unit: 'px',
    };

    const result = tokensToCssModule(tokensObj, options);
    const expectedOutput = `:root {\n  --fontSize: 16px;\n  --color: red;\n}`;

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

    const result = tokensToCssModule(tokensObj, options);
    const expectedOutput = `:root {\n  /* spacing */\n  --spacing-small: 8px;\n  --spacing-medium: 16px;\n}`;

    expect(result).toBe(expectedOutput);
  });
});
