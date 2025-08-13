import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/vars.css";
import backgroundImage from "../../assets/index_background.png";
import resultCardBackgroundImage from "../../assets/result_card_background.png";
import taegeukgiImage from "../../assets/taegeukgi.png";
import resultCardMapFrameImage from "../../assets/result_card_map_frame.png";
import resultCardMessageFrameImage from "../../assets/result_card_message_frame.png";
import resultFlowerImage from "../../assets/result_flower.png";
import resultCardLineImage from "../../assets/result_card_line.png";

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
  gap: "36px",
  maxWidth: "400px",
  width: "100%",
  padding: "20px 0",
  boxSizing: "border-box",
});

// Header styles
export const headerSection = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
});

export const mainTitle = style({
  fontFamily: vars.fonts.yeongnamnu,
  fontSize: "40px",
  fontWeight: "400",
  color: vars.colors.primary,
});

export const subtitle = style({
  fontFamily: vars.fonts.yeongnamnu,
  fontSize: "24px",
  color: "#404040",
  fontWeight: "400",
});

// Card placeholder styles
export const cardContainer = style({
  width: "360px",
  height: "640px",
  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${resultCardBackgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "36px",
  alignItems: "center",
  padding: "28px 18px",
});

export const cardTitle = style({
  width: "241px",
  height: "134px",
  backgroundImage: `url(${taegeukgiImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

export const cardContent = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
});

export const cardMapContainer = style({
  width: "250px",
  height: "170px",
  gap: "12px",
  position: "relative",
  padding: "10px",
});

export const cardMapFrame = style({
  width: "100%",
  height: "100%",
  backgroundImage: `url(${resultCardMapFrameImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

export const cardMap = style({
  width: "100%",
  height: "100%",
  background: "#f7f7f7",
});

export const cardMessageContainer = style({
  marginTop: "-20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",

  width: "270px",
  height: "118px",
  backgroundImage: `url(${resultCardMessageFrameImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
  padding: "18px",
});

export const cardMessage = style({
  fontSize: "18px",
  fontWeight: "400",
  wordBreak: "keep-all",
  textAlign: "center",
  fontFamily: vars.fonts.yeongnamnu,
});

export const cardUserName = style({
  fontSize: "16px",
  fontWeight: "400",
  fontFamily: vars.fonts.yeongnamnu,
  textAlign: "center",
});

export const cardFlowers = style({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  marginTop: "-36px",
  position: "relative",
});

export const cardFlowerLeft = style({
  width: "60px",
  height: "auto",
  aspectRatio: "1/1",
  backgroundImage: `url(${resultFlowerImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

export const cardFlowerRight = style({
  width: "60px",
  height: "auto",
  aspectRatio: "1/1",
  backgroundImage: `url(${resultFlowerImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  transform: "scaleX(-1)",
});

export const cardFooter = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  gap: "17px",
  fontFamily: vars.fonts.yeongnamnu,
  fontSize: "18px",
  fontWeight: "400",
  color: "#433B2A",
});

export const cardFooterLine = style({
  width: "100%",
  height: "1px",
  backgroundImage: `url(${resultCardLineImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

// Button styles
export const buttonContainer = style({
  display: "flex",
  gap: "16px",
  justifyContent: "center",
  width: "100%",
  padding: "0 10px",
});

export const button = style({
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  fontSize: "18px",
  fontWeight: "400",
  fontFamily: vars.fonts.yeongnamnu,
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxSizing: "border-box",

  ":hover": {
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

export const saveButton = style({
  backgroundColor: "rgba(255, 230, 239, 1)",
  border: `1px solid ${vars.colors.primary}`,
  color: vars.colors.primary,
  ":hover": {
    backgroundColor: "rgba(250, 207, 203, 0.8)",
  },
});

export const shareButton = style({
  backgroundColor: vars.colors.primary,
  color: "white",
  border: "none",
  ":hover": {
    backgroundColor: "rgba(216, 73, 63, 0.9)",
  },
});
