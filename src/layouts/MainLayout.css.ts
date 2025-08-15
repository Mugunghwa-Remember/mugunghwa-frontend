import { style } from "@vanilla-extract/css";

import backgroundImage from "../assets/index_background.png";

export const mainLayout = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100dvh",
  alignItems: "center",
  overflowY: "auto",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  padding: "0 20px",
  boxSizing: "border-box",
});

export const hasBackground = style({
  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${backgroundImage})`,
});
