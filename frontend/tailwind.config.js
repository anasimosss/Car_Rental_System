/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FCA311",
        accent: "#FCA311",
        navy: "#14213D",
        ink: "#000000",
        line: "#E5E5E5",
      },
    },
  },
  plugins: [],
};
