const tokens = require('./src/theme/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Todos los valores vienen de src/theme/tokens.js
      colors: {
        oficiar: tokens.oficiar,
        neutro: tokens.neutro,
        peligro: tokens.peligro,
      },
      borderRadius: tokens.radio,
      spacing: tokens.espacio,
      fontSize: tokens.texto,
      minHeight: tokens.toque,
      minWidth: tokens.toque,
    },
  },
  plugins: [],
};