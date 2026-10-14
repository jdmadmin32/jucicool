/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#138443",
          lime: "#8CC63E",
          yellow: "#FFC928",
          orange: "#F7941D",
          bg: "#FFFEF7",
          text: "#183D2B",
          muted: "#68756B",
          card: "#FFFFFF",
          border: "#E6EBDD",
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(19, 132, 67, 0.08)',
        'card': '0 6px 24px -4px rgba(24, 61, 43, 0.07)',
        'hover': '0 12px 32px -4px rgba(19, 132, 67, 0.16)',
      }
    },
  },
  plugins: [],
}
