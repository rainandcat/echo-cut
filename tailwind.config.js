/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B46C1',
        secondary: '#8b5cf6',
        light: '#F3F4F6',
        'brand-border': '#D8B4FE',
      },
      boxShadow: {
        card: '0 4px 8px rgba(244, 144, 253, 0.1)',
      },
      borderRadius: {
        xl: '1rem',
      }
    },
  },
  plugins: [],
}

