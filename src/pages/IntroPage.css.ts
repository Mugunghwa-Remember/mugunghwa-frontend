import { style } from "@vanilla-extract/css";
import { vars } from "../styles/vars.css";
import { fadeUp } from "../styles/animations.css";
import backgroundImage from "../assets/index_background.png";

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
  fontSize: "32px",
  fontWeight: "400",
  color: vars.colors.primary,
  whiteSpace: "nowrap",
  margin: 0,
  "@media": {
    "screen and (min-width: 640px)": {
      fontSize: "52px",
    },
  },
});

export const subtitle = style({
  fontFamily: vars.fonts.yeongnamnu,
  fontSize: "18px",
  fontWeight: "400",
  margin: 0,
  color: vars.colors.ink,
  "@media": {
    "screen and (min-width: 640px)": {
      fontSize: "28px",
    },
  },
});

export const flower = style({
  width: "350px",
  height: "auto",
  aspectRatio: "1 / 1",
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
});

export const buttonContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
  width: "100%",
  padding: "0 24px",
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
});

export const footerText = style({
  fontSize: "20px",
  fontWeight: "600",
  color: "rgba(117, 117, 117, 1)",
  fontFamily: vars.fonts.pretendard,
});

// Animation
export const fadeUpAnimation = style({
  animation: `${fadeUp} 0.6s ease-out`,
});
