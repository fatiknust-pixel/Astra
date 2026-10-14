import { loadFont } from "@remotion/fonts";
import { arquivo } from "./dados";

// Fonte embutida no projeto (public/fonts), então funciona offline e no render.
for (const peso of ["600", "700", "800", "900"]) {
  loadFont({ family: "Montserrat", url: arquivo(`fonts/montserrat-latin-${peso}-normal.woff2`), weight: peso, format: "woff2" });
}

export const FONTE = "Montserrat, 'Arial Black', Arial, sans-serif";

// Posições verticais (px) dentro do quadro 1080x1920, respeitando a área segura do TikTok
export const POSICAO: Record<string, number> = {
  topo: 210,
  alto: 420,
  alto2: 640,
  meio: 880,
  meio2: 1090,
};
