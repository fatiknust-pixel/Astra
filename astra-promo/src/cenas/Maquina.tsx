import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { MARCAS, quando } from "../dados";
import { COR, MONO, SANS, useFormato } from "../tema";
import { Celular, Destaque, Tela, noCelular, posCelular } from "../componentes/Celular";
import { Camera } from "../componentes/Camera";
import { Rotulo, Surge } from "../componentes/Texto";
import { Sfx } from "../componentes/Som";

const ID = "maquina";

// Ficha da máquina: cada campo ganha uma linha até um rótulo explicativo
export const Maquina = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { v, W, H } = useFormato();
  const CEL = v ? { x: 40, y: 640, largura: 400 } : posCelular(false);
  const trava = 10;
  const abre = 16;
  const telaSobe = spring({ frame: f - abre, fps, config: { damping: 18, stiffness: 140 } });
  const dds = MARCAS["maquina-7"].el[".plate dd"];
  const campos = [
    { i: 0, nome: "Nº de série", valor: "SN-2024-0277", em: quando(ID, "série", 0, 50) - 4, cor: COR.claro },
    { i: 1, nome: "Torque", valor: "9 N·m", em: quando(ID, "torque", 0, 62) - 4, cor: COR.claro },
    { i: 2, nome: "Posto", valor: "Posto 10", em: quando(ID, "posto", 0, 74) - 4, cor: COR.claro },
    { i: 4, nome: "Situação", valor: "Não encontrada", em: quando(ID, "situação", 0, 86) - 4, cor: COR.vermelho },
  ];
  const toque = campos[3].em + 18;
  // ponto de chegada de cada linha (onde fica o rótulo)
  const destino = (k: number) => (v ? { x: 490, y: 770 + k * 175 } : { x: 960, y: 500 + k * 120 });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: CEL.x, top: CEL.y }}>
        <Celular largura={CEL.largura} rotY={v ? 4 : -4} rotX={4}>
          {f < abre + 14 && <Camera f={f + 40} texto="MAQ:7" legenda="MÁQUINA 7" trava={trava + 40} fundo="maquina" />}
          <Tela nome="maquina-7" style={{ transform: `translateY(${(1 - telaSobe) * 844}px)` }}>
            {campos.map((c) => (
              <Destaque key={c.i} r={dds[c.i]} p={interpolate(f, [c.em, c.em + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} cor={c.cor === COR.vermelho ? COR.vermelho : COR.azul} raio={6} folga={3} />
            ))}
          </Tela>
        </Celular>
      </div>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {campos.map((c, k) => {
          const r = dds[c.i];
          const a = noCelular(CEL.largura, r[0] + r[2] + 4, r[1] + r[3] / 2);
          const x1 = CEL.x + a.x;
          const y1 = CEL.y + a.y;
          const { x: x2, y: y2 } = destino(k);
          const d = `M ${x1} ${y1} C ${x1 + 80} ${y1}, ${x2 - 100} ${y2}, ${x2} ${y2}`;
          const p = interpolate(f, [c.em, c.em + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
        const s = spring({ frame: f - c.em - 5, fps, config: { damping: 14, stiffness: 160 } });
        const { x, y } = destino(k);
        const valor =
          c.i === 4 ? (
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: v ? 32 : 36, color: COR.vermelho, border: `2.5px solid ${COR.vermelho}`, borderRadius: 999, padding: "8px 24px", background: "rgba(255,90,95,0.12)", whiteSpace: "nowrap" }}>
              {c.valor}
            </div>
          ) : (
            <div style={{ fontFamily: c.i === 0 ? MONO : SANS, fontWeight: 600, fontSize: v ? 42 : 50, color: COR.branco, whiteSpace: "nowrap" }}>{c.valor}</div>
          );
        const nome = (
          <div style={{ width: v ? undefined : 230, fontFamily: MONO, fontWeight: 600, fontSize: v ? 20 : 24, letterSpacing: 3, color: COR.suave, textTransform: "uppercase" }}>{c.nome}</div>
        );
        return v ? (
          <div key={k} style={{ position: "absolute", left: x + 16, top: y - 50, display: "flex", flexDirection: "column", gap: 8, opacity: s, transform: `translateX(${(1 - s) * 50}px)` }}>
            {nome}
            {valor}
          </div>
        ) : (
          <div key={k} style={{ position: "absolute", left: x + 15, top: y - 33, display: "flex", alignItems: "center", gap: 24, opacity: s, transform: `translateX(${(1 - s) * 50}px)` }}>
            {nome}
            {valor}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: v ? 70 : 900, top: v ? 200 : 150, width: 960 }}>
        <Rotulo texto="02 · Máquinas" em={2} />
        <Surge texto="Cada máquina tem o seu QR." em={4} tamanho={v ? 60 : 66} intervalo={2} style={{ marginTop: 24 }} />
        <Surge texto="Tudo em um toque." em={toque} tamanho={44} peso={600} cor={COR.ciano} style={{ marginTop: 14 }} />
      </div>
      <Sfx nome="bipe" em={trava} volume={0.5} />
      <Sfx nome="whoosh" em={abre - 2} volume={0.3} />
      {campos.map((c, k) => (
        <Sfx key={k} nome="pop" em={c.em + 5} volume={0.4} />
      ))}
    </AbsoluteFill>
  );
};
