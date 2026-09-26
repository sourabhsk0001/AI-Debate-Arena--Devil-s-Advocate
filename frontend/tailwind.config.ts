import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090A0F",
        surface: "#11131F",
        "surface-light": "#191D2F",
        "surface-border": "#232842",
        primary: {
          50: "#fff1f2",
          100: "#ffe4e6",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          DEFAULT: "#e11d48",
        },
        devil: {
          light: "#ff6b81",
          DEFAULT: "#e8112d",
          dark: "#990012",
          glow: "rgba(232, 17, 45, 0.35)",
        },
        user: {
          light: "#60a5fa",
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
        },
        judge: {
          light: "#fbbf24",
          DEFAULT: "#d97706",
          dark: "#b45309",
        },
      },
    },
  },
  plugins: [],
};

export default config;
