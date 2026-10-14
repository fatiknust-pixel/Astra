import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { MARCAS, quando } from "../dados";
import { COR, MONO, SANS } from "../tema";
import { Celular, Destaque, Tela, noCelular } from "../componentes/Celular";
import { Camera } from "../componentes/Camera";
import { Rotulo, Surge } from "../componentes/Texto";
import { Sfx } from "../componentes/Som";
import { CEL } from "./Escanear";

const ID = "maquina";

// Ficha da máquina: cada campo ganha uma linha até um rótulo explicativo
export const Maquina = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const trava = 26;
  const abre = 36;
  const telaSobe = spring({ frame: f - abre, fps, config: { damping: 18, stiffness: 120 } });
  const dds = MARCAS["maquina-7"].el[".plate dd"];
  const campos = [
    { i: 0, nome: "Nº de série", valor: "SN-2024-0277", em: quando(ID, "série", 0, 110) - 6, cor: COR.claro },
    { i: 1, nome: "Torque", valor: "9 N·m", em: quando(ID, "torque", 0, 130) - 4, cor: COR.claro },
    { i: 2, nome: "Posto", valor: "Posto 10", em: quando(ID, "posto", 0, 145) - 4, cor: COR.claro },
    { i: 4, nome: "Situação", valor: "Não encontrada", em: quando(ID, "situação", 0, 160) - 4, cor: COR.vermelho },
  ];
  const toque = quando(ID, "toque", 0, 200);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: CEL.x, top: CEL.y }}>
        <Celular largura={CEL.largura} rotY={-4} rotX={4}>
          {f < abre + 20 && <Camera f={f + 40} texto="MAQ:7" legenda="MÁQUINA 7" trava={trava + 40} fundo="maquina" />}
          <Tela nome="maquina-7" style={{ transform: `translateY(${(1 - telaSobe) * 844}px)` }}>
            {campos.map((c) => (
              <Destaque key={c.i} r={dds[c.i]} p={interpolate(f, [c.em, c.em + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} cor={c.cor === COR.vermelho ? COR.vermelho : COR.azul} raio={6} folga={3} />
            ))}
          </Tela>
        </Celular>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {campos.map((c, k) => {
          const r = dds[c.i];
          const a = noCelular(CEL.largura, r[0] + r[2] + 4, r[1] + r[3] / 2);
          const x1 = CEL.x + a.x;
          const y1 = CEL.y + a.y;
          const x2 = 960;
          const y2 = 500 + k * 120;
          const d = `M ${x1} ${y1} C ${x1 + 120} ${y1}, ${x2 - 160} ${y2}, ${x2} ${y2}`;
          const p = interpolate(f, [c.em, c.em + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (p <= 0) return null;
          const ev = evolvePath(p, d);
          return (
            <g key={k}>
              <circle cx={x1} cy={y1} r={7} fill={c.cor} />
              <path d={d} stroke={c.cor} strokeWidth={3} fill="none" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} opacity={0.85} />
            </g>
          );
        })}
      </svg>
      {campos.map((c, k) => {
        const s = spring({ frame: f - c.em - 8, fps, config: { damping: 14 } });
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: 975,
              top: 500 + k * 120 - 33,
              display: "flex",
              alignItems: "center",
              gap: 24,
              opacity: s,
              transform: `translateX(${(1 - s) * 50}px)`,
            }}
          >
            <div style={{ width: 230, fontFamily: MONO, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: COR.suave, textTransform: "uppercase" }}>{c.nome}</div>
            {c.i === 4 ? (
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, color: COR.vermelho, border: `2.5px solid ${COR.vermelho}`, borderRadius: 999, padding: "8px 26px", background: "rgba(255,90,95,0.12)" }}>
                {c.valor}
              </div>
            ) : (
              <div style={{ fontFamily: c.i === 0 ? MONO : SANS, fontWeight: 600, fontSize: 50, color: COR.branco }}>{c.valor}</div>
            )}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 900, top: 150, width: 960 }}>
        <Rotulo texto="02 · Máquinas" em={6} />
        <Surge texto="Cada máquina tem o seu QR." em={10} tamanho={66} style={{ marginTop: 24 }} />
        <Surge texto="Tudo em um toque." em={toque - 10} tamanho={44} peso={600} cor={COR.ciano} style={{ marginTop: 14 }} />
      </div>
      <Sfx nome="bipe" em={trava} volume={0.5} />
      <Sfx nome="whoosh" em={abre - 2} volume={0.3} />
      {campos.map((c, k) => (
        <Sfx key={k} nome="pop" em={c.em + 8} volume={0.4} />
      ))}
    </AbsoluteFill>
  );
};
