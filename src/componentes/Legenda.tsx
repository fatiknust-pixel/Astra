import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useVideo } from "../contexto";
import { FONTE } from "../tema";

type P = { p: string; ini: number; fim: number };

// Agrupa palavras em "telas" de N palavras, quebrando também nas pausas da fala.
const agrupar = (palavras: P[], n: number) => {
  const telas: P[][] = [];
  let atual: P[] = [];
  palavras.forEach((w, i) => {
    const anterior = palavras[i - 1];
    if (atual.length >= n || (anterior && w.ini - anterior.fim > 7)) {
      telas.push(atual);
      atual = [];
    }
    atual.push(w);
  });
  if (atual.length) telas.push(atual);
  return telas;
};

// Legenda palavra por palavra: cada palavra surge quando é falada e a palavra atual fica destacada.
export const Legenda: React.FC = () => {
  const f = useCurrentFrame();
  const { cenas, legenda, tema, estilo } = useVideo();
  const modo = estilo.legenda;
  const porTela = modo === "palavra" ? 1 : modo === "discreta" ? 6 : legenda.palavrasPorTela;
  const telas = useMemo(
    () => cenas.flatMap((c) => agrupar(c.palavras.map((w) => ({ ...w, ini: w.ini + c.inicio, fim: w.fim + c.inicio })), porTela)),
    [cenas, porTela]
  );
  const destaque = legenda.corDestaque ?? tema.destaque;
  const idx = telas.findIndex((t, i) => f >= t[0].ini && f < (telas[i + 1]?.[0].ini ?? t[t.length - 1].fim + 12));
  const tela = telas[idx];
  if (!tela || f > tela[tela.length - 1].fim + 12) return null;

  return (
    <AbsoluteFill style={{ top: 1250, bottom: "auto", height: 260, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 40px", maxWidth: 940 }}>
        {tela.map((w, i) => {
          if (f < w.ini) return null;
          const ativa = f >= w.ini && (f < w.fim + 2 || i === tela.length - 1 || f < tela[i + 1].ini);
          const k = Math.min(1, (f - w.ini) / 4);
          const base: React.CSSProperties = {
            fontFamily: FONTE,
            display: "inline-block",
            textTransform: estilo.maiusculas && modo !== "discreta" ? "uppercase" : "none",
          };
          const visual: React.CSSProperties =
            modo === "palavra"
              ? { fontWeight: 900, fontSize: 130, lineHeight: 1.1, color: "#fff", transform: `scale(${1 + (1 - k) * 0.35})`, WebkitTextStroke: "12px #000", paintOrder: "stroke fill", textShadow: `0 0 40px ${destaque}88, 0 10px 24px rgba(0,0,0,.8)` }
              : modo === "caixa"
              ? { fontWeight: 900, fontSize: 84, lineHeight: 1.25, color: ativa ? "#111" : "#fff", background: ativa ? destaque : "transparent", borderRadius: 14, padding: "0 14px", transform: `scale(${ativa ? 1.04 + (1 - k) * 0.12 : 1}) rotate(${ativa ? -2 : 0}deg)`, textShadow: ativa ? "none" : "0 6px 18px rgba(0,0,0,.9)", WebkitTextStroke: ativa ? "0" : "8px #000", paintOrder: "stroke fill" }
              : modo === "discreta"
              ? { fontWeight: 700, fontSize: 64, lineHeight: 1.3, color: ativa ? destaque : "rgba(255,255,255,.92)", opacity: 0.4 + 0.6 * k, textShadow: "0 3px 12px rgba(0,0,0,.95)" }
              : { fontWeight: 900, fontSize: 92, lineHeight: 1.15, color: ativa ? destaque : "#fff", transform: `scale(${ativa ? 1.04 + (1 - k) * 0.16 : 1}) translateY(${(1 - k) * 18}px)`, WebkitTextStroke: "10px #000", paintOrder: "stroke fill", textShadow: "0 8px 22px rgba(0,0,0,0.8)" };
          return (
            <span key={i} style={{ ...base, ...visual }}>
              {w.p}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
