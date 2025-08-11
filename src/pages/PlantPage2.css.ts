import { style } from "@vanilla-extract/css";
import { vars } from "../styles/vars.css";

export const section = style({
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100vh",
});

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  gap: "48px",
  maxWidth: "1040px",
  width: "100%",
});

export const titleContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "16px",
  width: "100%",
});

export const title = style({
  fontFamily: vars.fonts.yeongnamnu,
  fontSize: "40px",
  fontWeight: "400",
  color: vars.colors.ink,
  margin: 0,
});

export const instruction = style({
  fontFamily: vars.fonts.pretendard,
  fontSize: "24px",
  fontWeight: "600",
  color: "rgba(117, 117, 117, 1)",
  margin: 0,
});

export const content = style({
  display: "flex",
  flexDirection: "row",
  gap: "100px",
  width: "100%",

  "@media": {
    "(max-width: 628px)": {
      flexDirection: "column-reverse",
      gap: "24px",
    },
  },
});

export const leftSection = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  maxWidth: "360px",
  width: "100%",
  gap: "20px",
});

export const formContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "100%",
});

export const inputContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "100%",
});

export const inputGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  alignItems: "flex-start",
  width: "100%",
});

export const label = style({
  fontFamily: vars.fonts.pretendard,
  fontSize: "20px",
  fontWeight: "600",
  color: vars.colors.ink,
});

export const nameInput = style({
  padding: "12px 16px",
  border: "1px solid rgba(194, 194, 194, 1)",
  borderRadius: "8px",
  fontSize: "18px",
  fontFamily: vars.fonts.pretendard,
  fontWeight: "400",
  backgroundColor: "white",
  transition: "all 0.1s ease",
  width: "100%",

  ":focus": {
    outline: "none",
    borderColor: vars.colors.primary,
    boxShadow: "0 0 0 3px rgba(216, 73, 63, 0.1)",
  },

  "::placeholder": {
    color: "rgba(0, 0, 0, 0.4)",
  },
});

export const nameInputError = style({
  fontFamily: vars.fonts.pretendard,
  padding: "0 8px",
  color: vars.colors.primary,
  fontWeight: "400",
  fontSize: "16px",
});

export const messageInput = style({
  padding: "12px 16px",
  border: "1px solid rgba(194, 194, 194, 1)",
  borderRadius: "8px",
  fontSize: "18px",
  fontFamily: vars.fonts.yeongnamnu,
  fontWeight: "400",
  backgroundColor: "white",
  resize: "none",
  minHeight: "80px",
  transition: "all 0.1s ease",
  width: "100%",
  height: "160px",

  ":focus": {
    outline: "none",
    borderColor: vars.colors.primary,
    boxShadow: "0 0 0 3px rgba(216, 73, 63, 0.1)",
  },

  "::placeholder": {
    color: "rgba(0, 0, 0, 0.4)",
  },
});

export const buttonGroup = style({
  display: "flex",
  gap: "10px",
});

export const plantButton = style({
  flex: "1",
  padding: "16px 24px",
  backgroundColor: "rgba(255, 230, 239, 1)",
  border: `1px solid ${vars.colors.primary}`,
  color: vars.colors.primary,
  borderRadius: "10px",
  fontSize: "18px",
  fontWeight: "400",
  fontFamily: vars.fonts.yeongnamnu,
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxSizing: "border-box",

  ":hover": {
    backgroundColor: "rgba(250, 207, 203, 0.8)",
    transform: "translateY(-1px)",
  },

  ":active": {
    transform: "translateY(0)",
  },

  ":disabled": {
    border: "1px solid transparent",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    color: "rgba(0, 0, 0, 0.4)",
    cursor: "not-allowed",
    transform: "none",
  },
});

export const randomButton = style({
  flex: "1",
  padding: "16px 24px",
  backgroundColor: vars.colors.primary,
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "18px",
  fontWeight: "400",
  fontFamily: vars.fonts.yeongnamnu,
  cursor: "pointer",
  transition: "all 0.2s ease",

  ":hover": {
    backgroundColor: "rgba(216, 73, 63, 0.9)",
    transform: "translateY(-1px)",
  },

  ":active": {
    transform: "translateY(0)",
  },
});

export const bottomInstruction = style({
  fontFamily: vars.fonts.pretendard,
  fontSize: "18px",
  color: "rgba(117, 117, 117, 1)",
  fontWeight: "600",
  margin: 0,
  textAlign: "left",
});

export const rightSection = style({
  flex: "1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const mapPlaceholder = style({
  width: "100%",
  height: "100%",
  borderRadius: "16px",
  overflow: "hidden",
});

export const modalOverlay = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
});

export const modal = style({
  backgroundColor: "white",
  borderRadius: "20px",
  padding: "36px 39px",
  maxWidth: "500px",
  width: "100%",
  textAlign: "center",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
  gap: "22px",
  display: "flex",
  flexDirection: "column",
});

export const modalHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const modalTitle = style({
  fontFamily: vars.fonts.yeongnamnu,
  fontSize: "28px",
  fontWeight: "400",
  color: "rgba(0, 0, 0, 1)",
});

export const modalDescription = style({
  fontFamily: vars.fonts.pretendard,
  fontSize: "20px",
  color: "rgba(0, 0, 0, 1)",
  fontWeight: "600",
});

export const modalActions = style({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  alignItems: "center",
});

export const donationButton = style({
  backgroundColor: vars.colors.primary,
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "10px",
  fontSize: "18px",
  fontWeight: "400",
  fontFamily: vars.fonts.yeongnamnu,
  cursor: "pointer",
  transition: "all 0.2s ease",
  width: "100%",

  ":hover": {
    backgroundColor: "rgba(216, 73, 63, 0.9)",
    transform: "translateY(-1px)",
  },
});

export const closeButton = style({
  backgroundColor: "transparent",
  color: "rgba(117, 117, 117, 1)",
  border: "none",
  fontSize: "16px",
  fontFamily: vars.fonts.pretendard,
  cursor: "pointer",
  transition: "color 0.2s ease",
  borderBottom: "1px solid rgba(135, 135, 135, 1)",
  width: "fit-content",

  ":hover": {
    color: vars.colors.ink,
  },
});
