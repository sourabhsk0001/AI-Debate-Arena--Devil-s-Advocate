import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./component/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
          glow: "rgba(37, 99, 235, 0.35)",
        },
        judge: {
          light: "#fbbf24",
          DEFAULT: "#d97706",
          dark: "#b45309",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-slow": "glow 4s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 15px rgba(225, 29, 72, 0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(225, 29, 72, 0.7)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
