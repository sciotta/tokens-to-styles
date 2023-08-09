import { tokensToCssModule, formatCssWithPrettier } from './index';

const theme = {
    colors: {
      red: {
        100: '#FFEEEE',
        200: '#FFCDCD',
        300: '#EB0505',
        400: '#D00000',
        500: '#B2011B',
      },
      neutral: {
        100: '#FFFFFF',
        200: '#F7F8FA',
        300: '#EDEFF3',
        400: '#DCDFE5',
        500: '#CCD1D7',
        600: '#B2BBC2',
        700: '#919EA8',
        800: '#6D7B88',
        900: '#4B5863',
        1000: '#101820',
      },
    },
    space: {
      100: '2px',
      200: '4px',
      300: '6px',
      400: '8px',
      500: '12px',
      600: '16px',
      700: '24px',
      800: '32px',
      900: '40px',
      1000: '48px',
      1100: '56px',
      1200: '64px',
      1300: '72px',
      1400: '80px',
      1500: '96px',
      1600: '112px',
      1700: '136px',
      1800: '160px',
      1900: '192px',
      2000: '256px',
    },
  };
  
const a = tokensToCssModule(theme);

formatCssWithPrettier(a).then((res) => {
 console.log(res);
});

