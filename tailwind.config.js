/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        claude: {
          orange: '#CC785C',
          purple: '#8B5CF6',
        }
      }
    },
  },
  plugins: [],
}
