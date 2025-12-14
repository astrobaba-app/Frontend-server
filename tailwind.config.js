const { fontFamily } = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['var(--font-kanit)', ...fontFamily.sans],
        inter: ['var(--font-inter)', ...fontFamily.sans],
      },
      colors: {
        black: '#333333',
        yellow:"#F0DF20",
        offYellow:"#FCF5CC",
        cream:"#FBFAF8",
        darkYellow:"#FFE07B" ,  
        red:"#FF0000",
        green:"#04A82A",
      },
    },
  },
  plugins: [],
};