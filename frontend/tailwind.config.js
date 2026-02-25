/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './constants/**/*.{ts,tsx}', // <--- Verifique se a pasta do seu objeto está aqui!
  ],
  // ... rest of config
}