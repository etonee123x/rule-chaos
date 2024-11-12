import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        initial: 'initial',
        'body-initial': colors.neutral[900],
        transparent: 'transparent',
        'current-color': 'currentColor',
        primary: colors.emerald,
        secondary: colors.orange,
        tetriary: colors.pink,
      },
      spacing: {
        '5.5': '22px',
      },
    },
    borderRadius: {
      0: '0',
      DEFAULT: '8px',
      lg: '16px',
      sm: '4px',
      full: '9999px',
      circle: '100%',
    },
  },
  plugins: [],
  corePlugins: {
    container: false,
  },
};
