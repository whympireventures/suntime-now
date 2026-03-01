/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: "#061220",
        astro: "#1a2f45",
        nautical: "#2d5a7b",
        civil: "#4a8fa8",
        golden: "#f5a623",
        daylight: "#87ceeb",
        sunrise: "#ff6b35",
        sunset: "#c0392b",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};
