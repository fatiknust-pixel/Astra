import { loadFont } from "@remotion/fonts";
import { arquivo } from "./dados";

// Fontes embutidas no projeto (public/fonts): funcionam offline e no render.
export const FONTES: Record<string, { familia: string; arquivo: string; pesos: string[] }> = {
  montserrat: { familia: "Montserrat", arquivo: "montserrat", pesos: ["600", "700", "800", "900"] },
  poppins: { familia: "Poppins", arquivo: "poppins", pesos: ["700", "800", "900"] },
  oswald: { familia: "Oswald", arquivo: "oswald", pesos: ["600", "700"] },
  raleway: { familia: "Raleway", arquivo: "raleway", pesos: ["700", "800", "900"] },
  playfair: { familia: "Playfair Display", arquivo: "playfair-display", pesos: ["700", "800", "900"] },
  robotoslab: { familia: "Roboto Slab", arquivo: "roboto-slab", pesos: ["700", "800", "900"] },
};
for (const f of Object.values(FONTES)) {
  for (const peso of f.pesos) {
    loadFont({ family: f.familia, url: arquivo(`fonts/${f.arquivo}-latin-${peso}-normal.woff2`), weight: peso, format: "woff2" });
  }
}

// A família real de cada vídeo vem da variável --fonte, definida na raiz da composição.
export const FONTE = "var(--fonte), Montserrat, 'Arial Black', Arial, sans-serif";

// Posições verticais (px) dentro do quadro 1080x1920, respeitando a área segura do TikTok
export const POSICAO: Record<string, number> = {
  topo: 210,
  alto: 420,
  alto2: 640,
  meio: 880,
  meio2: 1090,
};
