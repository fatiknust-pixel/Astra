import { loadFont } from "@remotion/fonts";
import { staticFile, useVideoConfig } from "remotion";

// Fontes embutidas no projeto (public/fonts): as mesmas do app (IBM Plex), funcionam offline e no render.
for (const peso of ["400", "500", "600", "700"]) {
  loadFont({ family: "IBM Plex Sans", url: staticFile(`fonts/ibm-plex-sans-latin-${peso}-normal.woff2`), weight: peso, format: "woff2" });
}
for (const peso of ["500", "600"]) {
  loadFont({ family: "IBM Plex Mono", url: staticFile(`fonts/ibm-plex-mono-latin-${peso}-normal.woff2`), weight: peso, format: "woff2" });
}

export const SANS = "'IBM Plex Sans', system-ui, sans-serif";
export const MONO = "'IBM Plex Mono', ui-monospace, monospace";

// Paleta: o azul marinho do app (#0B2A5B) e o azul claro do tema escuro (#8DB2F5)
export const COR = {
  noite: "#040B1A",
  fundo: "#071634",
  marinho: "#0B2A5B",
  azul: "#2F6BFF",
  claro: "#8DB2F5",
  ciano: "#5CD3FF",
  branco: "#F4F7FB",
  suave: "rgba(244,247,251,0.68)",
  linha: "rgba(141,178,245,0.22)",
  verde: "#2FD07F",
  vermelho: "#FF5A5F",
  ambar: "#FFB547",
} as const;

/** Formato do vídeo atual: vertical (9:16) ou horizontal (16:9). */
export const useFormato = () => {
  const { width, height } = useVideoConfig();
  return { v: height > width, W: width, H: height };
};
