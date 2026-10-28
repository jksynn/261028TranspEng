/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eff3fa', 100: '#dbe4f3', 200: '#b6c8e6', 500: '#2f5597',
          600: '#243f7a', 700: '#1b3262', 800: '#142550', 900: '#0d1a3a',
        },
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
