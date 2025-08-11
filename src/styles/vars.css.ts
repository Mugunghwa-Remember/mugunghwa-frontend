import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  colors: {
    primary: "rgba(255, 92, 152, 1)",
    ink: "rgba(64, 64, 64, 1)",
    paper: "#f8f4ed",
  },
  fonts: {
    sans: '"Noto Sans KR", system-ui, Arial, sans-serif',
    pen: '"Nanum Pen Script", cursive',
    yeongnamnu: '"MYYeongnamnu", "Noto Sans KR", system-ui, Arial, sans-serif',
    pretendard:
      '"Pretendard-Regular", "Noto Sans KR", system-ui, Arial, sans-serif',
  },
  shadows: {
    soft: "0 8px 30px rgba(0, 0, 0, 0.1)",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
});
