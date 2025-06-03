/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        notion: {
          50: '#fafafa',
          100: '#f4f4f5',
          500: '#71717a',
          800: '#27272a',
        }
      }
    },
  },
  plugins: [],
} 