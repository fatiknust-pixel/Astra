import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { imagem } from "../dados";
import { COR } from "../tema";

// Fundo da cena: foto com efeito Ken Burns + escurecimento, ou gradiente animado se não houver foto.
export const Fundo: React.FC<{ chave?: string; indice: number; duracao: number }> = ({ chave, indice, duracao }) => {
  const f = useCurrentFrame();
  const src = imagem(chave);
  const t = f / Math.max(1, duracao);
  const dir = indice % 2 === 0 ? 1 : -1;
  return (
    <AbsoluteFill style={{ background: COR.fundo, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${50 + Math.sin(f / 40) * 20}% ${30 + Math.cos(f / 50) * 10}%, ${indice % 2 ? "#3A1C71" : "#12305C"} 0%, ${COR.fundo} 65%)`,
        }}
      />
      {src && (
        <Img
          src={src}
          style={{
            position: "absolute", width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${1.12 + t * 0.14}) translateX(${dir * interpolate(t, [0, 1], [-30, 30])}px)`,
            filter: "saturate(1.1) contrast(1.05)",
          }}
        />
      )}
      {/* escurece para o texto aparecer */}
      <AbsoluteFill style={{ background: src ? "linear-gradient(180deg, rgba(11,15,26,.55) 0%, rgba(11,15,26,.35) 35%, rgba(11,15,26,.75) 62%, rgba(11,15,26,.95) 100%)" : "transparent" }} />
      {/* grade em movimento (motion graphics) */}
      <AbsoluteFill
        style={{
          opacity: 0.12,
          backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `0px ${(f * 1.5) % 90}px`,
          maskImage: "radial-gradient(circle at 50% 40%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 40%, black 0%, transparent 75%)",
        }}
      />
      {/* partículas */}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = (i * 137) % 1080;
        const y = 1920 - ((f * (1 + (i % 4) * 0.6) + i * 210) % 2100);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 6 + (i % 3) * 4, height: 6 + (i % 3) * 4, borderRadius: 99, background: i % 3 ? COR.amarelo : "#fff", opacity: 0.25 }} />;
      })}
    </AbsoluteFill>
  );
};
