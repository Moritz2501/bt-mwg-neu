import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        night: {
          50: "#eef1ff",
          100: "#d7ddff",
          200: "#b1bcff",
          300: "#7f8eff",
          400: "#5a5cf6",
          500: "#3d33e3",
          600: "#2c26b6",
          700: "#241f8b",
          800: "#1b1a5e",
          900: "#111132"
        },
        ink: "#0b0d1a",
        glow: "#7e6bff"
      },
      borderRadius: {
        xl: "1rem",
        pill: "9999px"
      },
      boxShadow: {
        neon: "0 0 24px rgba(126, 107, 255, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
