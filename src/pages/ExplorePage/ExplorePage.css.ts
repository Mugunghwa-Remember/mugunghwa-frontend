import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/vars.css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flexGrow: 1,
  gap: "40px",
  maxWidth: "728px",
  width: "100%",
  padding: "20px 0",
  boxSizing: "border-box",

  "@media": {
    "(max-width: 768px)": {
      gap: "20px",
    },
  },
});

export const headerSection = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
  width: "100%",

  "@media": {
    "(max-width: 768px)": {
      alignItems: "center",
    },
  },
});

export const mainTitle = style({
  fontFamily: vars.fonts.yeongnamnu,
  fontSize: "36px",
  fontWeight: "400",
  color: "#000000",

  "@media": {
    "(max-width: 768px)": {
      fontSize: "22px",
    },
  },
});

export const subtitle = style({
  fontFamily: vars.fonts.pretendard,
  fontWeight: "600",
  fontSize: "20px",
  color: "#757575",

  "@media": {
    "(max-width: 768px)": {
      fontSize: "16px",
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

export const map = style({
  width: "100%",
  maxHeight: "640px",
  height: "100%",
});
