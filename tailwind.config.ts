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
        // ─── A1 design system (BaytyAI brand — light premium theme) ───
        bayty: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9d6fb',
          300: '#7db0f3',
          400: '#3377db',
          500: '#0052cc', // primary
          600: '#003d99',
          700: '#002a66',
        },
        steel: {
          50: '#fafafa',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        orange: {
          50: '#fef3f0',
          300: '#ff8a5e',
          400: '#ff6b35', // accent
          600: '#e85a24',
        },
        forest: { 50: '#f0fdf4', 400: '#2e7d32', 600: '#15803d' },
        sky: { 50: '#ecf7ff', 400: '#0891b2', 600: '#0369a1' },
        crimson: { 50: '#fef2f2', 400: '#dc2626', 600: '#b91c1c' },
        // Semantic aliases (A1 light) — back the shadcn-style tokens used across
        // the dashboard so those surfaces render as light by default.
        background: '#fafafa',
        foreground: '#111827',
        card: { DEFAULT: '#ffffff', foreground: '#111827' },
        primary: { DEFAULT: '#0052cc', foreground: '#ffffff' },
        muted: { DEFAULT: '#f3f4f6', foreground: '#6b7280' },
        destructive: { DEFAULT: '#dc2626', foreground: '#ffffff' },
        border: '#e5e7eb',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
        // Playfair Display — premium serif for display headings (A1 design)
        display: ['var(--font-display)', 'Georgia', 'serif'],
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
        // A1 design — soft, premium rounding for the light theme surfaces
        card: '16px',
        xl2: '20px',
        pill: '9999px',
      },
      boxShadow: {
        // A1 elevation scale (subtle, layered)
        'a1-sm': '0 1px 2px rgba(17,24,39,0.06), 0 1px 3px rgba(17,24,39,0.05)',
        'a1-md': '0 4px 12px rgba(17,24,39,0.08)',
        'a1-lg': '0 12px 32px rgba(17,24,39,0.10)',
        'a1-glow': '0 8px 28px rgba(0,82,204,0.18)',
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
