import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/vars.css";
import backgroundImage from "../../assets/index_background.png";

export const section = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100dvh",
  alignItems: "center",
  overflowY: "auto",
  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  padding: "0 20px",
  boxSizing: "border-box",
});

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
});

export const headerSection = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
  width: "100%",
});

export const mainTitle = style({
  fontFamily: vars.fonts.yeongnamnu,
  fontSize: "36px",
  fontWeight: "400",
  color: "#000000",
});

export const subtitle = style({
  fontFamily: vars.fonts.pretendard,
  fontWeight: "600",
  fontSize: "20px",
  color: "#757575",
});

export const map = style({
  width: "100%",
  maxHeight: "640px",
  height: "100%",
});
