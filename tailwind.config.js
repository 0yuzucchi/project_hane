/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
    './resources/js/**/*.js',
  ],
  theme: {
    extend: {
      // Tambahkan blok 'colors' di sini
      colors: {
        'light-bg': '#FBFBFB',
      },
    },
  },
  plugins: [],
}