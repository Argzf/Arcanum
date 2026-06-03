import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'media', // use system preference
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0C0E13',
        'grad-start': '#ffffff',
        'grad-mid': '#CAE0FF',
        'grad-end': '#6597E9',
      },
    },
  },
  plugins: [],
};
export default config;
