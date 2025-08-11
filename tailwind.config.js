// /** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx,html}"],
  theme: {
    extend: {
      colors: {
        primary: "#d8493f",
        ink: "#343434",
        paper: "#f8f4ed",
        rose: { 50: "#fff1f3", 100: "#ffe4e8" },
      },
      fontFamily: {
        sans: ["Noto Sans KR", "system-ui", "Arial", "sans-serif"],
        pen: ["Nanum Pen Script", "cursive"],
        yeongnamnu: [
          "MYYeongnamnu",
          "Noto Sans KR",
          "system-ui",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: { soft: "0 8px 30px rgba(0,0,0,0.10)" },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        bloom: {
          "0%": { transform: "scale(0)", opacity: 0 },
          "70%": { transform: "scale(1.08)", opacity: 1 },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        fadeUp: "fadeUp .6s ease-out",
        bloom: "bloom .6s cubic-bezier(.2,.8,.2,1.2)",
      },
    },
  },
  plugins: [],
};
