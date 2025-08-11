import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            naverMapClientId: env.VITE_APP_NAVER_MAP_CLIENT_KEY,
          },
        },
      }),
      vanillaExtractPlugin(),
      svgr({
        svgrOptions: {
          icon: false,
          // keep viewBox and props pass-through
          plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        },
        include: "**/*.svg?react",
      }),
    ],
  };
});
