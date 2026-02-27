/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Forum', 'serif'],
        subheading: ['Graphik', 'Inter', 'sans-serif'],
      },
      colors: {
        'custom-teal': {
          DEFAULT: '#5B7A77',
          50: '#E8F2F1',
          100: '#D1E5E3',
          200: '#B9D8D5',
          300: '#A2CBC7',
          400: '#8ABDB9',
          500: '#7EADA9',
          600: '#5B7A77',
          700: '#4A7A76',
          800: '#355855',
          900: '#203634',
        },
      },
    },
  },
  plugins: [],
}
