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
        light: '#e6d1f3',
        dark:'#1F2937',
        time:'#b57fd4',
        textMain:'#1a0f25',
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

