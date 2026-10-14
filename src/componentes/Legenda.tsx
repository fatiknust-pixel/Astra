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
  const { cenas, legenda, tema } = useVideo();
  const telas = useMemo(
    () => cenas.flatMap((c) => agrupar(c.palavras.map((w) => ({ ...w, ini: w.ini + c.inicio, fim: w.fim + c.inicio })), legenda.palavrasPorTela)),
    [cenas, legenda]
  );
  const idx = telas.findIndex((t, i) => f >= t[0].ini && f < (telas[i + 1]?.[0].ini ?? t[t.length - 1].fim + 12));
  const tela = telas[idx];
  if (!tela || f > tela[tela.length - 1].fim + 12) return null;

  return (
    <AbsoluteFill style={{ top: 1250, bottom: "auto", height: 260, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 30px", maxWidth: 940 }}>
        {tela.map((w, i) => {
          if (f < w.ini) return null;
          const ativa = f >= w.ini && (f < w.fim + 2 || i === tela.length - 1 || f < tela[i + 1].ini);
          const k = Math.min(1, (f - w.ini) / 4);
          const escala = ativa ? 1.06 + (1 - k) * 0.2 : 1;
          return (
            <span
              key={i}
              style={{
                fontFamily: FONTE,
                fontWeight: 900,
                fontSize: 92,
                lineHeight: 1.15,
                textTransform: "uppercase",
                color: ativa ? legenda.corDestaque ?? tema.destaque : "#fff",
                transform: `scale(${escala}) translateY(${(1 - k) * 18}px)`,
                display: "inline-block",
                WebkitTextStroke: "10px #000",
                paintOrder: "stroke fill",
                textShadow: "0 8px 22px rgba(0,0,0,0.8)",
              }}
            >
              {w.p}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
