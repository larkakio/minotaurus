import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        labyrinth: {
          bg: "#0a0e1a",
          grid: "#1e3a8a",
          wall: "#4c1d95",
          wallGlow: "#a78bfa",
          minotaur: "#dc2626",
          minotaurGlow: "#fca5a5",
          temple: "#10b981",
          cyan: "#06b6d4",
          purple: "#a855f7",
        },
      },
    },
  },
  plugins: [],
};
export default config;
