import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ include: /\.[jt]sx?$/ })],
  server: {
    proxy: {
      "/auth": { target: "http://localhost:5000", changeOrigin: true },
      "/user": { target: "http://localhost:5000", changeOrigin: true },
      "/invoice": { target: "http://localhost:5000", changeOrigin: true },
      "/template": { target: "http://localhost:5000", changeOrigin: true },
      "/ocr": { target: "http://localhost:5000", changeOrigin: true },
      "/ticket": { target: "http://localhost:5000", changeOrigin: true }
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
});
