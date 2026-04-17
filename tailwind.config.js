/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: // tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sitka: {
          'blue-main': '#306896', // Biru tombol & outline active
          'blue-dark': '#1e3a8a', // Untuk teks judul
          'gray-text': '#8c95a1', // Untuk placeholder & label
          'bg-light': '#f9fafb', // Background halaman
        }
      },
      // Menambahkan custom shadow agar mirip dengan referensi
      boxShadow: {
        'sitka-card': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
  plugins: [],
}
