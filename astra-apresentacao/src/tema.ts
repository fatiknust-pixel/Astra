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

// Visual claro, como o próprio app: papel cinza-azulado, tinta escura e o azul marinho da marca.
export const COR = {
  papel: "#ECEFF3",
  papel2: "#DFE5EC",
  branco: "#FFFFFF",
  tinta: "#0F1A2B",
  suave: "#4A5568",
  apagado: "#8A95A6",
  marinho: "#0B2A5B",
  marinho2: "#143C7F",
  claro: "#8DB2F5",
  linha: "rgba(15,26,43,0.14)",
  vermelho: "#C0392B",
  verde: "#1E8E5A",
} as const;

export const SOMBRA = "0 22px 60px rgba(15,26,43,0.16), 0 2px 6px rgba(15,26,43,0.08)";

/** Formato do vídeo atual: vertical (9:16) ou horizontal (16:9). */
export const useFormato = () => {
  const { width, height } = useVideoConfig();
  return { v: height > width, W: width, H: height };
};

/** Área de conteúdo ao lado (16:9) ou abaixo (9:16) do painel azul de cada capítulo. */
export const useArea = () => {
  const { v } = useFormato();
  return v ? { x: 70, y: 650, w: 940, h: 960 } : { x: 740, y: 130, w: 1070, h: 740 };
};

/** Entrada suave (0→1) a partir do quadro `em`, sem quicar. */
export const entrada = (f: number, em: number, dur = 16) =>
  interpolate(f, [em, em + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
