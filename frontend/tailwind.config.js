/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#f6f8f7',
          dark: '#14281d',
          mid: '#355834',
          accent: '#f1a208'
        }
      }
    },
  },
  plugins: [],
};
