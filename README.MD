# tokens-to-styles

A simple JavaScript library for converting design tokens into CSS variables exported through the `:root` pseudo-class.

## Installation

You can install `tokens-to-styles` using npm:

```bash
npm install tokens-to-styles
```

## Usage

```javascript
const tts = require('tokens-to-styles');

const tokens = {
  colors: {
    primary: '#000',
    secondary: '#fff',
  },
  fontSizes: {
    small: '12px',
    medium: '16px',
    large: '20px',
  },
};

const styles = tts.tokensToCssModule(tokens);
console.log(styles);
```

This will output:

```css
:root {
  /* colors */
  --colors-primary: #000;
  --colors-secondary: #fff;

  /* ------------------------- */

  /* fontSizes */
  --fontSizes-small: 12px;
  --fontSizes-medium: 16px;
  --fontSizes-large: 20px;
}
```

## How it works

The `tokens-to-styles` library takes a JavaScript object representing design tokens and converts it into a CSS module with variables exported through the `:root` pseudo-class. This allows for easy integration of design tokens into your stylesheets.

## API

### tokensToCssModule(tokens)

 ***tokens***: An object containing design tokens organized by categories (e.g., colors, fontSizes).
Returns a string representing the CSS module with variables exported through the `:root` pseudo-class.
