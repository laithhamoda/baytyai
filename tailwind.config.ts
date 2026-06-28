import tailwindcssAnimate from 'tailwindcss-animate';

import type { Config } from 'tailwindcss';

const config: Config = {
  // Enable dark-mode via class (shadcn/ui requires this).
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07090C',
          900: '#0E1116',
          800: '#161B22',
          700: '#21262D',
          500: '#767E8A',
          300: '#B1B9C2',
          100: '#E6E9EE',
        },
        paper: '#F5F6F8',
        signal: {
          500: '#C5A572',
          600: '#A8895C',
        },
        alert: {
          500: '#D9534F',
        },
        success: {
          500: '#3FA796',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      fontSize: {
        // clamp for h2
        'display-lg': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', fontWeight: '600' }],
      },
      maxWidth: {
        container: '1200px',
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '2px',
        md: '2px',
        lg: '2px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
