/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        vault: {
          bg: "#0a0a0d",
          panel: "#15151d",
          border: "#2a2a36",
          input: "#1a1a24",
          muted: "#9b9cc0",
          gold: "#d9a441",
          goldDark: "#c2902f",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
