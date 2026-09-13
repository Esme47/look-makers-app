import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lmPink: "#e8bfbf",
        lmGold: "#b8934a",
        lmCream: "#f4ede4",
        lmDark: "#3a2f2a",
        lmMuted: "#8a7a70",
      },
      fontFamily: {
        voice: ["'Playfair Display'", "serif"],
        sans: ["'Poppins'", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
      },
    },
  },
  plugins: [],
};
export default config;
