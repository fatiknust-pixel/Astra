import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, useCurrentFrame } from "remotion";
import { CENAS, CenaTempo, DURACAO_TOTAL, arquivo, creditoImagem, todosCreditos } from "./dados";
import { Elemento } from "./componentes/Elementos";
import { Fundo } from "./componentes/Fundo";
import { Legenda } from "./componentes/Legenda";
import { COR, FONTE } from "./tema";

// Fontes confiáveis da cena, no topo da tela
const Fontes: React.FC<{ fontes: string[] }> = ({ fontes }) => {
  const f = useCurrentFrame();
  if (!fontes.length) return null;
  return (
    <div style={{ position: "absolute", top: 70, left: 40, right: 140, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
      <div style={{ fontFamily: FONTE, fontWeight: 900, fontSize: 26, color: "#111", background: COR.amarelo, padding: "6px 14px", borderRadius: 8, opacity: interpolate(f, [4, 10], [0, 1], { extrapolateRight: "clamp" }) }}>FONTES</div>
      {fontes.map((t, i) => {
        const m = spring({ frame: f - 8 - i * 4, fps: 30, config: { damping: 14 } });
        return (
          <div key={i} style={{ fontFamily: FONTE, fontWeight: 700, fontSize: 25, color: "#fff", background: "rgba(0,0,0,.6)", border: "1px solid rgba(255,255,255,.25)", padding: "6px 14px", borderRadius: 8, opacity: m, transform: `translateY(${(1 - m) * -20}px)` }}>
            {t}
          </div>
        );
      })}
    </div>
  );
};

// Faixas diagonais que cruzam a tela na troca de cena
const Transicao: React.FC = () => {
  const f = useCurrentFrame();
  if (f > 12) return null;
  const cores = [COR.amarelo, COR.vermelho, "#fff"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {cores.map((c, i) => {
        const x = interpolate(f, [0 + i, 10 + i], [-1600, 1600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={i} style={{ position: "absolute", top: -400, left: x, width: 260, height: 2800, background: c, transform: "rotate(18deg)", opacity: 0.9 }} />;
      })}
    </AbsoluteFill>
  );
};

const Cena: React.FC<{ c: CenaTempo }> = ({ c }) => {
  const f = useCurrentFrame();
  const credito = creditoImagem(c.fundo);
  const zoom = interpolate(f, [0, 10], [1.08, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Fundo chave={c.fundo} indice={c.indice} duracao={c.duracao} />
      </AbsoluteFill>
      {c.audio && <Sequence from={4} layout="none"><Audio src={c.audio} /></Sequence>}
      {c.indice > 0 && <Audio src={arquivo("sfx/whoosh.mp3")} volume={0.5} />}
      {c.elementos.map((e) => (
        <Sequence key={e.indice} from={e.entra} durationInFrames={Math.max(1, e.sai - e.entra)}>
          <Elemento e={e} />
        </Sequence>
      ))}
      <Fontes fontes={c.fontes} />
      {credito && (
        <div style={{ position: "absolute", left: 40, right: 160, top: 1530, fontFamily: FONTE, fontWeight: 600, fontSize: 20, color: "rgba(255,255,255,.55)" }}>{credito}</div>
      )}
      {c.id === "final" && <Creditos />}
      <Transicao />
    </AbsoluteFill>
  );
};

const Creditos: React.FC = () => {
  const lista = todosCreditos();
  return (
    <div style={{ position: "absolute", left: 40, right: 160, top: 1530, fontFamily: FONTE, fontWeight: 600, fontSize: 17, lineHeight: 1.35, color: "rgba(255,255,255,.5)" }}>
      {lista.length ? `Imagens (Wikimedia Commons): ${lista.join(" · ")}` : ""}
    </div>
  );
};

const Progresso: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 12, background: "rgba(255,255,255,.15)" }}>
      <div style={{ width: `${(f / DURACAO_TOTAL) * 100}%`, height: "100%", background: COR.amarelo, boxShadow: `0 0 20px ${COR.amarelo}` }} />
    </div>
  );
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: COR.fundo }}>
    <Audio src={arquivo("sfx/trilha.mp3")} volume={0.1} loop />
    {CENAS.map((c) => (
      <Sequence key={c.id} from={c.inicio} durationInFrames={c.duracao} name={c.id}>
        <Cena c={c} />
      </Sequence>
    ))}
    <Legenda />
    <Progresso />
  </AbsoluteFill>
);
