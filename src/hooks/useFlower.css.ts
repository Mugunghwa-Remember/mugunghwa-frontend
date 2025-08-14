import { style } from "@vanilla-extract/css";
import { vars } from "../styles/vars.css";
import flowerMessageFrameImage from "../assets/flower_message_frame.png";

export const markerContainer = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const userMarker = style({
  background: vars.colors.primary,
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  border: `3px solid white`,
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: vars.colors.primary,
  fontSize: "14px",
  fontWeight: "bold",
  cursor: "pointer",
  boxSizing: "border-box",
  transformOrigin: "center",
  position: "absolute",
  userSelect: "none",
});

export const flowerMessage = style({
  backgroundImage: `url(${flowerMessageFrameImage})`,
  backgroundSize: "100% 100%",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  padding: "12px 16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: vars.fonts.yeongnamnu,
  position: "absolute",
  marginBottom: "4px",
  bottom: "21px",
  fontSize: "16px",
  fontWeight: "400",
  color: "#433B2A",
  whiteSpace: "nowrap",
  maxWidth: "280",
});

export const flowerName = style({
  position: "absolute",
  top: "21px",
  fontSize: "14px",
  color: "#FFF",
  fontFamily: vars.fonts.yeongnamnu,
  backgroundColor: vars.colors.primary,
  border: `1.5px solid ${vars.colors.primary}`,
  padding: "4px 12px",
  borderRadius: "999px",
  whiteSpace: "nowrap",
});
