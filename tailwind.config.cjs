/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
  darkMode: "media",
  theme: {
    colors: {
      primary: "#7A3E3A",
      secondary: "#F3DD6D",
      transparent: "transparent",
      current: "currentColor",
      dark: "rgb(29, 37, 45)",
      "dark-transparent": "rgba(29, 37, 45, 0.95)",
      light: "rgb(249, 250, 251)",
      "light-transparent": "rgba(249, 250, 251, 0.7)",
      black: colors.black,
      white: colors.white,
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
