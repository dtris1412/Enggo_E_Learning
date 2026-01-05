/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.8s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [],
};
