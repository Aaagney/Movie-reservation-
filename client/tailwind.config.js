/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cine: {
          black: '#0a0a0c',
          panel: '#141416',
          panel2: '#1c1c1f',
          gold: '#d4af37',
          gold2: '#e8c766',
          muted: '#9a9aa2',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(212,175,55,0.35), 0 8px 30px rgba(0,0,0,0.5)',
        card: '0 10px 30px rgba(0,0,0,0.45)',
      },
    },
  },
  plugins: [],
};
