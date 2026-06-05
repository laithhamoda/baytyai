import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    borderRadius: {
      none: "0px",
      sm: "2px",
      DEFAULT: "2px",
      md: "2px",
      lg: "2px",
      xl: "2px",
      "2xl": "2px",
      full: "9999px",
    },
    extend: {
      colors: {
        navy: "#0A1628",
        gold: "#C9A84C",
        offwhite: "#F8F6F1",
        slate: "#2C3E50",
        goldBorder: "rgba(201,168,76,0.3)",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      spacing: {
        section: "120px",
        component: "64px",
      },
    },
  },
  plugins: [],
};

export default config;
