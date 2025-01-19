import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      cursor: {
        inherit: 'inherit',
      },
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
        unset: 'unset',
        '5.5': '22px',
        120: '480px',
      },
      keyframes: {
        'shake-protesting': {
          '10%': { transform: 'translateX(0)' },
          '14%': { transform: 'translateX(-5%)' },
          '18%': { transform: 'translateX(5%)' },
          '22%': { transform: 'translateX(-5%)' },
          '26%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'shake-protesting': 'shake-protesting 2s ease-in-out infinite',
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
