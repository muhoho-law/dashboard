// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        customPrimary: {
          50: '#e6f7fa',
          100: '#b3e5f3',
          200: '#80d3ee',
          300: '#4dc1e8',
          400: '#26b2e3',
          500: '#00a3da', // Your main primary color
          600: '#0091c7',
          700: '#007cae',
          800: '#006696',
          900: '#005080',
          950: '#003c66',
        }
      }
    }
  }
};
