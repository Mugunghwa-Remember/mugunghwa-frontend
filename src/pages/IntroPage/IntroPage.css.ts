import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/vars.css";
import { fadeUp } from "../../styles/animations.css";
import backgroundImage from "../../assets/index_background.png";

// Base styles
export const introSection = style({
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100vh",
  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  overflow: "hidden",
  padding: "20px",
});

export const introContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "28px",
  maxWidth: "840px",
  width: "100%",
  animation: `${fadeUp} 0.8s ease-out`,

  "@media": {
    "screen and (max-width: 768px)": {
      gap: "20px",
    },
  },
});

export const titleContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  textAlign: "center",
});

export const title = style({
  fontFamily: vars.fonts.yeongnamnu,
  fontSize: "40px",
  fontWeight: "400",
  color: vars.colors.primary,
  whiteSpace: "nowrap",
  margin: 0,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "32px",
    },
  },
});

export const subtitle = style({
  fontFamily: vars.fonts.yeongnamnu,
  fontSize: "24px",
  fontWeight: "400",
  margin: 0,
  color: vars.colors.ink,
  whiteSpace: "nowrap",

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "20px",
    },
  },
});

export const flower = style({
  width: "300px",
  height: "auto",
  aspectRatio: "1 / 1",

  "@media": {
    "screen and (max-width: 768px)": {
      width: "250px",
    },
  },
});

export const descriptionContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px",
  width: "100%",
});

export const description = style({
  fontFamily: vars.fonts.yeongnamnu,
  fontSize: "24px",
  fontWeight: "400",
  color: vars.colors.ink,
  margin: 0,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "18px",
    },
  },
});

export const mobileBreak = style({
  display: "none",

  "@media": {
    "screen and (max-width: 768px)": {
      display: "inline",
    },
  },
});

export const buttonContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
  width: "100%",
  padding: "0 24px",

  "@media": {
    "screen and (max-width: 768px)": {
      padding: "0",
    },
  },
});

export const startButton = style({
  fontFamily: vars.fonts.yeongnamnu,
  background: vars.colors.primary,
  color: "white",
  width: "100%",
  padding: `${vars.spacing.md} 0`,
  borderRadius: vars.borderRadius.xl,
  fontSize: "24px",
  fontWeight: "400",
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 10px 30px rgba(216, 73, 63, 0.3)",
  },

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "16px",
    },
  },
});

export const footerText = style({
  fontSize: "16px",
  fontWeight: "600",
  color: "rgba(117, 117, 117, 1)",
  fontFamily: vars.fonts.pretendard,

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "14px",
    },
  },
});

// Animation
export const fadeUpAnimation = style({
  animation: `${fadeUp} 0.6s ease-out`,
});
