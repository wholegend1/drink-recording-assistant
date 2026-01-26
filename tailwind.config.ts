import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 這裡對應 globals.css 裡的 CSS 變數
      colors: {
        primary: {
          DEFAULT: "var(--theme-primary)",
          light: "var(--theme-primary-light)",
          dark: "var(--theme-primary-dark)",
        },
        accent: "var(--theme-accent)",
        bg: "var(--theme-bg)",
        "card-bg": "var(--theme-card-bg)",
        text: {
          DEFAULT: "var(--theme-text)",
          sub: "var(--theme-text-sub)",
        },
        "input-bg": "var(--theme-input-bg)",
        border: "var(--theme-border)",
        badge: "var(--theme-badge)",
      },
      borderRadius: {
        "2xl": "20px",
      },
      boxShadow: {
        calendar:
          "0 2px 8px -2px rgba(0,0,0,0.1), 0 1px 3px -1px rgba(0,0,0,0.06)",
        ios: "0 4px 20px rgba(0,0,0,0.05)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
export default config;
