import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile, useVideoConfig } from "remotion";

for (const peso of ["400", "500", "600", "700"]) {
  loadFont({ family: "IBM Plex Sans", url: staticFile(`fonts/ibm-plex-sans-latin-${peso}-normal.woff2`), weight: peso, format: "woff2" });
}
for (const peso of ["500", "600"]) {
  loadFont({ family: "IBM Plex Mono", url: staticFile(`fonts/ibm-plex-mono-latin-${peso}-normal.woff2`), weight: peso, format: "woff2" });
}

export const SANS = "'IBM Plex Sans', system-ui, sans-serif";
export const MONO = "'IBM Plex Mono', ui-monospace, monospace";

// Paleta sóbria: grafite, branco e um único destaque (âmbar). Verde e vermelho só para os LEDs (liberado/negado).
export const COR = {
  fundo: "#0F1113",
  painel: "#16191C",
  painel2: "#1C2024",
  linha: "rgba(255,255,255,0.12)",
  grade: "rgba(255,255,255,0.035)",
  texto: "#F2F3F4",
  suave: "#A3A9B0",
  apagado: "#62686F",
  destaque: "#E3A23B",
  verde: "#3FB27F",
  vermelho: "#E5534B",
} as const;

/** Formato do vídeo atual: vertical (9:16) ou horizontal (16:9). */
export const useFormato = () => {
  const { width, height } = useVideoConfig();
  return { v: height > width, W: width, H: height };
};

/** Entrada suave (0→1) a partir do quadro `em`, sem quicar. */
export const entrada = (f: number, em: number, dur = 16) =>
  interpolate(f, [em, em + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
