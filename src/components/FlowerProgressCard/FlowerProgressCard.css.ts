import { style, keyframes } from "@vanilla-extract/css";
import { createVar } from "@vanilla-extract/css";
import { vars } from "../../styles/vars.css";

// CSS 변수 정의
export const progressWidthVar = createVar();

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const progressFillAnimation = keyframes({
  "0%": { width: "0%" },
  "100%": { width: "100%" },
});

export const progressCard = style({
  background: "rgba(255, 255, 255, 0.9)",
  borderRadius: "20px",
  padding: "24px 32px",
  border: "1px solid rgba(250, 207, 203, 1)",
  maxWidth: "580px",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  boxSizing: "border-box",
});

export const progressTitle = style({
  fontFamily: vars.fonts.yeongnamnu,
  fontSize: "24px",
  fontWeight: "400",
  color: "rgba(0, 0, 0, 1)",
  textAlign: "center",
});

export const progressContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const progressInfo = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontFamily: vars.fonts.yeongnamnu,
  fontSize: "18px",
  padding: "0 8px",
});

export const currentCount = style({
  color: "rgba(0, 0, 0, 1)",
  fontWeight: "400",
});

export const targetCount = style({
  color: vars.colors.primary,
  fontWeight: "400",
});

export const progressBar = style({
  width: "100%",
  height: "12px",
  backgroundColor: "#f0f0f0",
  borderRadius: "6px",
  overflow: "hidden",
  position: "relative",
});

export const progressFill = style({
  height: "100%",
  borderRadius: "6px",
  width: progressWidthVar,
  position: "relative",
  overflow: "hidden",
  transition: "width 0.3s ease",

  ":after": {
    content: "",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "6px",
    background:
      "linear-gradient(90deg, rgba(250, 207, 203, 1) 0%, rgba(255, 92, 152, 1) 100%)",
    animation: `${progressFillAnimation} 1s ease-out forwards`,
  },
});

export const progressFillAnimated = style({
  animation: `${progressFillAnimation} 1.5s ease-out forwards`,
});

// Loading and Error States
export const loadingState = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
});

export const loadingSpinner = style({
  width: "24px",
  height: "24px",
  border: "2px solid #f3f3f3",
  borderTop: `2px solid ${vars.colors.primary}`,
  borderRadius: "50%",
  animation: `${spin} 1s linear infinite`,
});

export const errorState = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
});

export const errorMessage = style({
  color: "#e74c3c",
  fontSize: "14px",
  textAlign: "center",
});

export const retryButton = style({
  background: vars.colors.primary,
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": {
    opacity: 0.8,
  },
});

export const lastUpdated = style({
  fontSize: "12px",
  color: "rgba(0, 0, 0, 0.5)",
  textAlign: "center",
  marginTop: "8px",
});
