import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { quando } from "../dados";
import { COR, MONO, SANS, entrada, useFormato } from "../tema";
import { Titulo } from "../componentes/Base";
import { Sfx } from "../componentes/Som";

const ID = "prototipo";
type Ponto = { x: number; y: number; t: string; d: string };
// Coordenadas nas fotos originais (placa: 1200×1600; painel: 1200×950)
const PLACA: Ponto[] = [
  { x: 690, y: 880, t: "Raspberry Pi Pico W", d: "o cérebro do sistema" },
  { x: 545, y: 975, t: "Relé", d: "libera a linha +15" },
  { x: 340, y: 1080, t: "Interface CAN", d: "MCP2515 · rede do carro" },
];
const PAINEL: Ponto[] = [
  { x: 314, y: 323, t: "Leitor de digital", d: "anel iluminado" },
  { x: 694, y: 295, t: "Tela", d: "mostra o status" },
  { x: 1002, y: 281, t: "Botão", d: "" },
];

/** Foto com marcações: ponto na foto, linha e rótulo ao lado. */
const Foto: React.FC<{ src: string; w: number; h: number; ow: number; oh: number; pontos: Ponto[]; ems: number[]; lado: "d" | "b"; x: number; y: number; rotX: number; em: number; rotY?: number[] }> = ({
  src, w, h, ow, oh, pontos, ems, lado, x, y, rotX, em, rotY,
}) => {
  const f = useCurrentFrame();
  const k = w / ow;
  const op = entrada(f, em, 18);
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 10, overflow: "hidden", border: `1px solid ${COR.linha}`, opacity: op }}>
        <Img src={staticFile(src)} style={{ width: w, height: oh * k, display: "block", filter: "saturate(0.75) contrast(1.05)" }} />
      </div>
      <svg width={4000} height={4000} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {pontos.map((p, i) => {
          const px = x + p.x * k;
          const py = y + p.y * k;
          const ly = rotY ? rotY[i] : py;
          const meio = Math.max(px + 20, rotX - 50);
          const d = lado === "d" ? `M ${px} ${py} H ${meio} V ${ly} H ${rotX - 10}` : `M ${px} ${py} V ${rotX}`;
          const pr = Math.max(0.0001, interpolate(f, [ems[i], ems[i] + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
          const ev = evolvePath(pr, d);
          return (
            <g key={i} opacity={pr > 0.001 ? 1 : 0}>
              <circle cx={px} cy={py} r={9} fill="none" stroke={COR.destaque} strokeWidth={2.5} />
              <circle cx={px} cy={py} r={3} fill={COR.destaque} />
              <path d={d} stroke={COR.destaque} strokeWidth={2} fill="none" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
            </g>
          );
        })}
      </svg>
      {pontos.map((p, i) => {
        const py = y + p.y * k;
        const px = x + p.x * k;
        const o = entrada(f, ems[i] + 8, 12);
        const st: React.CSSProperties = lado === "d" ? { left: rotX, top: (rotY ? rotY[i] : py) - 22 } : { left: px - 110, top: rotX + 8, width: 220, textAlign: "center" };
        return (
          <div key={i} style={{ position: "absolute", opacity: o, ...st }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: COR.texto, whiteSpace: "nowrap" }}>{p.t}</div>
            {p.d && <div style={{ fontFamily: MONO, fontSize: 19, color: COR.suave, whiteSpace: "nowrap" }}>{p.d}</div>}
          </div>
        );
      })}
    </>
  );
};

export const Prototipo = () => {
  const f = useCurrentFrame();
  const { v, W, H } = useFormato();
  const placa = Math.max(74, quando(ID, "placa", 0, 40) - 4);
  const leitor = Math.max(placa + 30, quando(ID, "leitor", 0, 90) - 4);
  const tela = Math.max(leitor + 10, quando(ID, "tela", 0, 110) - 4);
  const botao = Math.max(tela + 10, quando(ID, "botão", 0, 130) - 4);
  // Abertura: foto do veículo em tela cheia, com zoom lento
  const intro = interpolate(f, [0, 50, 66], [1, 1, 0], { extrapolateRight: "clamp" });
  const zoom = interpolate(f, [0, 66], [1.04, 1.12]);
  return (
    <AbsoluteFill>
      {intro > 0 && (
        <AbsoluteFill style={{ opacity: intro, zIndex: 2 }}>
          <Img src={staticFile("fotos/veiculo.jpg")} style={{ width: W, height: H, objectFit: "cover", objectPosition: "70% 50%", transform: `scale(${zoom})`, filter: "saturate(0.75)" }} />
          <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(15,17,19,0.9) 0%, rgba(15,17,19,0.1) 45%)" }} />
          <div style={{ position: "absolute", left: v ? 70 : 110, bottom: v ? 320 : 150, fontFamily: MONO, fontSize: 22, color: COR.texto, letterSpacing: 2 }}>
            PROTÓTIPO INSTALADO NO PAINEL DO VEÍCULO DE REFERÊNCIA
          </div>
        </AbsoluteFill>
      )}
      <Titulo n={8} rotulo="O protótipo" texto={v ? "Placa e painel de comando." : "A placa e o painel de comando."} em={54} style={{ position: "absolute", left: v ? 70 : 110, top: v ? 210 : 170, width: 1400 }} />
      {v ? (
        <>
          <Foto src="fotos/placa.jpg" w={430} h={560} ow={1200} oh={1600} pontos={PLACA} ems={[placa, placa + 10, placa + 20]} lado="d" x={70} y={430} rotX={560} rotY={[560, 700, 840]} em={60} />
          <Foto src="fotos/painel.jpg" w={940} h={480} ow={1200} oh={950} pontos={PAINEL} ems={[leitor, tela, botao]} lado="b" x={70} y={1040} rotX={1040 + 480 - 10} em={70} />
        </>
      ) : (
        <>
          <Foto src="fotos/placa.jpg" w={450} h={640} ow={1200} oh={1600} pontos={PLACA} ems={[placa, placa + 10, placa + 20]} lado="d" x={110} y={320} rotX={630} rotY={[470, 620, 770]} em={60} />
          <Foto src="fotos/painel.jpg" w={860} h={500} ow={1200} oh={950} pontos={PAINEL} ems={[leitor, tela, botao]} lado="b" x={950} y={320} rotX={320 + 500 + 6} em={70} />
        </>
      )}
      <Sfx nome="swoosh" em={60} volume={0.1} />
    </AbsoluteFill>
  );
};
