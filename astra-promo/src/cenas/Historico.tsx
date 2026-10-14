import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MARCAS, quando } from "../dados";
import { COR, MONO, SANS } from "../tema";
import { Celular, Destaque, Tela } from "../componentes/Celular";
import { Rotulo, Surge } from "../componentes/Texto";
import { Sfx } from "../componentes/Som";
import { CEL } from "./Escanear";

const ID = "historico";
// Mesmo histórico fictício das telas capturadas (scripts/capturar_telas.mjs)
const LOG = [
  { h: "14:02", u: "Elisangela", n: 7, campo: "Situação", de: "Não encontrada", para: "Encontrada", c: "#7C9CFF" },
  { h: "14:03", u: "Elisangela", n: 7, campo: "Torque", de: "9 N·m", para: "9,5 N·m", c: "#7C9CFF" },
  { h: "14:05", u: "Adeilson", n: 4, campo: "Posto", de: "5", para: "6", c: "#FFB547" },
  { h: "14:08", u: "Adeilson", n: 2, campo: "Situação", de: "Não encontrada", para: "Encontrada", c: "#FFB547" },
  { h: "14:10", u: "Admin", n: 9, campo: "Nº de série", de: "…0761", para: "…0762", c: "#2FD07F" },
];

export const Historico = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mud = quando(ID, "mudança", 0, 40);
  const quem = quando(ID, "quem", 0, 90);
  const que = quando(ID, "mudou", 0, 110) - 6;
  const qdo = quando(ID, "quando", 0, 130);
  const tags = [
    { t: "QUEM", em: quem, cor: COR.ambar },
    { t: "O QUÊ", em: que, cor: COR.ciano },
    { t: "QUANDO", em: qdo, cor: COR.verde },
  ];
  const ativo = (em: number, prox: number) => (f >= em && f < prox ? 1 : 0);
  const fq = ativo(quem, que);
  const fo = ativo(que, qdo);
  const fw = f >= qdo ? 1 : 0;
  const linhaAlt = interpolate(f, [mud - 6, mud + 40], [0, 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const wins = MARCAS["historico"].el[".win"];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: CEL.x, top: CEL.y }}>
        <Celular largura={CEL.largura} rotY={-4} rotX={4}>
          <Tela nome="historico">
            {wins.map((r, i) => (
              <Destaque key={i} r={r} p={interpolate(f, [mud + i * 18, mud + i * 18 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} cor={COR.azul} raio={8} />
            ))}
          </Tela>
        </Celular>
      </div>
      <div style={{ position: "absolute", left: 850, top: 110, width: 1000 }}>
        <Rotulo texto="04 · Histórico" em={4} />
        <Surge texto="Nada se perde." em={quando(ID, "nada", 0, 18) - 2} tamanho={80} style={{ marginTop: 20 }} />
        <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
          {tags.map((g, i) => {
            const on = f >= g.em;
            const s = spring({ frame: f - g.em, fps, config: { damping: 12 } });
            return (
              <div key={i} style={{ fontFamily: MONO, fontWeight: 600, fontSize: 24, letterSpacing: 3, padding: "8px 20px", borderRadius: 999, border: `2px solid ${on ? g.cor : "rgba(141,178,245,0.25)"}`, color: on ? g.cor : "rgba(141,178,245,0.4)", background: on ? `${g.cor}1A` : "transparent", transform: `scale(${1 + 0.12 * s * (1 - s) * 4})`, boxShadow: on ? `0 0 24px ${g.cor}44` : "none" }}>
                {g.t}
              </div>
            );
          })}
        </div>
      </div>
      {/* linha do tempo */}
      <div style={{ position: "absolute", left: 850, top: 392, width: 1040 }}>
        <div style={{ position: "absolute", left: 22, top: 0, width: 3, height: linhaAlt, background: `linear-gradient(${COR.azul}, ${COR.ciano})`, borderRadius: 2 }} />
        {LOG.map((l, i) => {
          const em = mud + i * 7;
          const s = spring({ frame: f - em, fps, config: { damping: 15, stiffness: 120 } });
          const bloco = i === 0 || i === 3;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: i * 96 + (i >= 3 ? 26 : 0), opacity: s, transform: `translateX(${(1 - s) * 80}px)`, width: 1040 }}>
              {bloco && (
                <div style={{ position: "absolute", left: 60, top: -26, fontFamily: MONO, fontSize: 18, color: COR.claro, letterSpacing: 2 }}>
                  {i === 0 ? "BLOCO 14:02 – 14:07" : "BLOCO 14:07 – 14:12"}
                </div>
              )}
              <div style={{ position: "absolute", left: 13, top: 29, width: 21, height: 21, borderRadius: 11, background: COR.fundo, border: `3px solid ${COR.ciano}` }} />
              <div style={{ marginLeft: 60, height: 78, borderRadius: 16, background: "rgba(13,30,64,0.78)", border: "1.5px solid rgba(141,178,245,0.2)", display: "flex", alignItems: "center", padding: "0 24px", gap: 22, fontFamily: SANS, boxShadow: "0 12px 30px rgba(0,0,0,0.3)" }}>
                <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 30, color: fw ? COR.verde : COR.branco, textShadow: fw ? `0 0 16px ${COR.verde}` : "none", width: 96 }}>{l.h}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 12, width: 196, padding: "6px 10px", borderRadius: 12, background: fq ? `${COR.ambar}26` : "transparent", outline: fq ? `2px solid ${COR.ambar}` : "none" }}>
                  <span style={{ width: 42, height: 42, borderRadius: 21, background: l.c, color: "#071634", fontWeight: 700, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{l.u[0]}</span>
                  <span style={{ fontSize: 24, color: COR.branco, fontWeight: 500 }}>{l.u}</span>
                </span>
                <span style={{ flex: 1, fontSize: 23, color: COR.suave, padding: "6px 10px", borderRadius: 12, background: fo ? `${COR.ciano}1F` : "transparent", outline: fo ? `2px solid ${COR.ciano}` : "none", whiteSpace: "nowrap", overflow: "hidden" }}>
                  <b style={{ color: COR.branco, fontWeight: 600 }}>Máq. {l.n}</b> · {l.campo}: {l.de} <span style={{ color: COR.ciano }}>→</span> <b style={{ color: COR.branco, fontWeight: 600 }}>{l.para}</b>
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {LOG.map((_, i) => (
        <Sfx key={i} nome="swoosh" em={mud + i * 7} volume={0.18} />
      ))}
      {tags.map((g, i) => (
        <Sfx key={"t" + i} nome="pop" em={g.em} volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};
