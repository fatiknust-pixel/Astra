import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Prévia instantânea do vídeo no navegador (Remotion Player) — sem renderizar MP4.
export default defineConfig({
  root: path.resolve(__dirname),
  publicDir: path.resolve(__dirname, "../public"),
  base: "./",
  plugins: [react()],
  build: { outDir: path.resolve(__dirname, "../dist-preview"), emptyOutDir: true, assetsInlineLimit: 0 },
  server: { host: true },
});
