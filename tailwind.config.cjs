/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
  darkMode: "media",
  theme: {
    colors: {
      primary: "#7C3C3C",
      secondary: "#f0e371",
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.coolGray,
      green: colors.lime,
      red: colors.red,
      yellow: colors.amber,
    },
    extend: {},
    screens: {
      sm: "540px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    fontFamily: {
      sans: ["Georama", "sans-serif"],
    },
  },
  plugins: [require("flowbite/plugin")],
};
