import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { useVideo } from "../contexto";
import { FONTE } from "../tema";

// "Dinâmica de edição": como o vídeo se movimenta, além de cores e fontes.
// - padrao     : sem efeitos extras
// - energetica : "câmera" dá socos de zoom a cada elemento novo e treme nos carimbos
// - cinema     : faixas pretas, grão de filme, vinheta e um zoom lento contínuo
// - jornal     : tarja "AO VIVO"/título e letreiro correndo embaixo, cortes secos
// - glitch     : distorção RGB e linhas de TV nas trocas de cena e nos elementos
// - colagem    : textura de papel, elementos tortos e movimento em "stop motion"
// - minimal    : remove partículas e efeitos, tudo mais calmo

// Frames (absolutos) em que um elemento entra, para os socos de câmera
const useBatidas = () => {
  const { cenas } = useVideo();
  return useMemo(() => {
    const b: { f: number; forte: boolean }[] = [];
    for (const c of cenas) {
      b.push({ f: c.inicio, forte: false });
      for (const e of c.elementos) b.push({ f: c.inicio + e.entra, forte: e.tipo === "carimbo" });
    }
    return b.sort((x, y) => x.f - y.f);
  }, [cenas]);
};

// Envolve as cenas e aplica o movimento de "câmera" da dinâmica escolhida
export const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const { estilo, duracao } = useVideo();
  const batidas = useBatidas();
  const d = estilo.dinamica;
  let transform = "";
  let filter = "";
  if (d === "energetica") {
    const ultima = [...batidas].reverse().find((b) => b.f <= f);
    const dt = ultima ? f - ultima.f : 99;
    const soco = Math.exp(-dt / 5);
    const tremor = ultima?.forte && dt < 10 ? (random(`t${f}`) - 0.5) * 18 * (1 - dt / 10) : 0;
    transform = `scale(${1 + 0.07 * soco}) translate(${tremor}px, ${tremor * 0.6}px) rotate(${soco * (ultima && ultima.f % 2 ? 1 : -1) * 0.8}deg)`;
  } else if (d === "cinema") {
    transform = `scale(${1 + 0.06 * (f / duracao)})`;
    filter = "saturate(0.85) contrast(1.08)";
  } else if (d === "colagem") {
    // stop motion: a "câmera" só muda de posição a cada 3 frames
    const q = Math.floor(f / 3);
    transform = `translate(${(random(`x${q}`) - 0.5) * 6}px, ${(random(`y${q}`) - 0.5) * 6}px) rotate(${(random(`r${q}`) - 0.5) * 0.6}deg)`;
  } else if (d === "glitch") {
    const ultima = [...batidas].reverse().find((b) => b.f <= f);
    const dt = ultima ? f - ultima.f : 99;
    if (dt < 5) transform = `translateX(${(random(`g${f}`) - 0.5) * 30}px) skewX(${(random(`s${f}`) - 0.5) * 6}deg)`;
  }
  return <AbsoluteFill style={{ transform, filter }}>{children}</AbsoluteFill>;
};

// Camadas por cima do vídeo (abaixo da legenda)
export const Sobreposicao: React.FC = () => {
  const f = useCurrentFrame();
  const { estilo, titulo, tema, cenas } = useVideo();
  const batidas = useBatidas();
  const d = estilo.dinamica;

  if (d === "cinema") {
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.65) 100%)" }} />
        <Grao f={f} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 110, background: "#000" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 110, background: "#000" }} />
      </AbsoluteFill>
    );
  }

  if (d === "jornal") {
    const texto = `${titulo.toUpperCase()}  •  ${cenas.flatMap((c) => c.fontes).filter((v, i, a) => a.indexOf(v) === i).join("  •  ")}  •  `;
    const largura = texto.length * 22;
    const x = -((f * 6) % largura);
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1560, height: 74, display: "flex", background: "#fff", overflow: "hidden" }}>
          <div style={{ flexShrink: 0, background: tema.vermelho, color: "#fff", fontFamily: FONTE, fontWeight: 900, fontSize: 32, padding: "0 22px", display: "flex", alignItems: "center", gap: 10, zIndex: 1 }}>
            <span style={{ width: 14, height: 14, borderRadius: 99, background: "#fff", opacity: f % 30 < 15 ? 1 : 0.3 }} /> AO VIVO
          </div>
          <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: x, display: "flex", alignItems: "center", whiteSpace: "nowrap", fontFamily: FONTE, fontWeight: 800, fontSize: 30, color: "#111" }}>
              {texto}{texto}{texto}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  if (d === "glitch") {
    const ultima = [...batidas].reverse().find((b) => b.f <= f);
    const dt = ultima ? f - ultima.f : 99;
    const forca = dt < 6 ? 1 - dt / 6 : 0;
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <AbsoluteFill style={{ opacity: 0.12, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.5) 0 2px, transparent 2px 6px)" }} />
        {forca > 0 && (
          <>
            <AbsoluteFill style={{ background: tema.vermelho, mixBlendMode: "screen", opacity: 0.25 * forca, transform: `translateX(${12 * forca}px)` }} />
            <AbsoluteFill style={{ background: tema.azul, mixBlendMode: "screen", opacity: 0.25 * forca, transform: `translateX(${-12 * forca}px)` }} />
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, top: random(`b${f}-${i}`) * 1920, height: 20 + random(`h${f}-${i}`) * 60, background: "rgba(255,255,255,.12)", transform: `translateX(${(random(`x${f}-${i}`) - 0.5) * 120}px)` }} />
            ))}
          </>
        )}
      </AbsoluteFill>
    );
  }

  if (d === "colagem") {
    return (
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.35 }}>
        <svg width="1080" height="1920">
          <filter id="papel"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(f / 3)} /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="1080" height="1920" filter="url(#papel)" />
        </svg>
      </AbsoluteFill>
    );
  }

  if (d === "energetica") {
    // flash curto a cada troca de cena
    const ultima = [...batidas].reverse().find((b) => b.f <= f && !b.forte);
    const dt = ultima ? f - ultima.f : 99;
    return <AbsoluteFill style={{ pointerEvents: "none", background: tema.destaque, opacity: interpolate(dt, [0, 3], [0.18, 0], { extrapolateRight: "clamp" }) }} />;
  }

  return null;
};

const Grao: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ opacity: 0.18, mixBlendMode: "overlay" }}>
    <svg width="1080" height="1920">
      <filter id="grao"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 12} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="1080" height="1920" filter="url(#grao)" />
    </svg>
  </AbsoluteFill>
);

// Ajuste por elemento: inclinação de colagem e entrada mais seca no jornal
export const ajusteElemento = (dinamica: string, indice: number): React.CSSProperties =>
  dinamica === "colagem" ? { rotate: `${(random(`el${indice}`) - 0.5) * 7}deg` } : {};
