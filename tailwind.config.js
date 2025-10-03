/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",            // needed if you have classes there
    "./src/**/*.{js,jsx,ts,tsx}" // includes all React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
