import { keyframes } from "@vanilla-extract/css";

export const fadeUp = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateY(10px)",
  },
  "100%": {
    opacity: 1,
    transform: "translateY(0)",
  },
});

export const bloom = keyframes({
  "0%": {
    transform: "scale(0)",
    opacity: 0,
  },
  "70%": {
    transform: "scale(1.08)",
    opacity: 1,
  },
  "100%": {
    transform: "scale(1)",
  },
});
