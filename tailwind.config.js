/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#e10600',
        'app-bg': '#0a0e1a',
        'app-card': '#111827',
        'app-border': '#1f2937',
        madrid: '#D71920',
        barcelona: '#004D98',
        valencia: '#FF6B2B',
        vuelo: '#6366f1',
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
