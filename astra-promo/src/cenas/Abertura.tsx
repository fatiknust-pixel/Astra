import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { makePolygon } from "@remotion/shapes";
import { evolvePath } from "@remotion/paths";
import { quando } from "../dados";
import { COR, MONO, useFormato } from "../tema";
import { Surge } from "../componentes/Texto";
import { Sfx } from "../componentes/Som";

const ID = "abertura";
const VALORES = ["7,4", "8,0", "17,6", "5,0", "2,0", "12,0", "0,7", "4,2", "18,0", "3,0", "1,2", "2,5", "5,5", "0,6"];

// Medidor de torque enchendo até 7,4 N·m + "Na linha de montagem, cada aperto conta."
export const Abertura = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { v, W, H } = useFormato();
  const ini = 4;
  const fim = 38;
  const p = interpolate(f, [ini, fim], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const ok = f >= fim;
  const pulso = spring({ frame: f - fim, fps, config: { damping: 10 } });
  const cx = v ? 540 : 560;
  const cy = v ? 640 : 500;
  const R = 230;
  const arco = `M ${cx + R * Math.cos((135 * Math.PI) / 180)} ${cy + R * Math.sin((135 * Math.PI) / 180)} A ${R} ${R} 0 1 1 ${cx + R * Math.cos((45 * Math.PI) / 180)} ${cy + R * Math.sin((45 * Math.PI) / 180)}`;
  const ev = evolvePath(Math.max(0.0001, p), arco);
  const hex = makePolygon({ points: 6, radius: 92, cornerRadius: 10 });
  const entrada = spring({ frame: f, fps, config: { damping: 18 } });
  const cada = quando(ID, "cada");
  const conta = quando(ID, "conta");
  const tiques = Array.from({ length: 10 }, (_, i) => ini + 2 + i * 3);
  return (
    <AbsoluteFill>
      {/* valores de torque subindo ao fundo */}
      {VALORES.map((v, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 60 + ((i * 137) % (W - 160)),
            top: H + 20 - ((f * (2 + (i % 3) * 0.8) + i * 160) % (H + 220)),
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 30 + (i % 4) * 12,
            color: COR.claro,
            opacity: 0.1 + (i % 3) * 0.04,
          }}
        >
          {v} N·m
        </div>
      ))}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${0.9 + 0.1 * entrada})`, opacity: entrada }}>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="g-arco" x1="0" x2="1">
              <stop offset="0" stopColor={COR.azul} />
              <stop offset="1" stopColor={COR.ciano} />
            </linearGradient>
            <filter id="brilho-arco" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>
          <path d={arco} stroke="rgba(141,178,245,0.15)" strokeWidth={26} fill="none" strokeLinecap="round" />
          {/* marcas da escala */}
          {Array.from({ length: 28 }, (_, i) => {
            const a = ((135 + (i / 27) * 270) * Math.PI) / 180;
            const r1 = R + 30;
            const r2 = R + (i % 3 === 0 ? 52 : 42);
            const aceso = i / 27 <= p;
            return (
              <line
                key={i}
                x1={cx + r1 * Math.cos(a)}
                y1={cy + r1 * Math.sin(a)}
                x2={cx + r2 * Math.cos(a)}
                y2={cy + r2 * Math.sin(a)}
                stroke={aceso ? COR.ciano : "rgba(141,178,245,0.3)"}
                strokeWidth={i % 3 === 0 ? 4 : 2.5}
                strokeLinecap="round"
              />
            );
          })}
          <path d={arco} stroke="url(#g-arco)" strokeWidth={26} fill="none" strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} filter="url(#brilho-arco)" opacity={0.8} />
          <path d={arco} stroke="url(#g-arco)" strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
          {/* parafuso sextavado girando enquanto aperta */}
          <g transform={`translate(${cx - hex.width / 2} ${cy - 30 - hex.height / 2}) rotate(${p * 540} ${hex.width / 2} ${hex.height / 2})`}>
            <path d={hex.path} fill="rgba(141,178,245,0.08)" stroke={COR.claro} strokeOpacity={0.5} strokeWidth={4} />
            <circle cx={hex.width / 2} cy={hex.height / 2} r={34} fill="none" stroke={COR.claro} strokeOpacity={0.35} strokeWidth={4} />
          </g>
          {ok && (
            <circle cx={cx} cy={cy} r={R + 20 + pulso * 60} fill="none" stroke={COR.verde} strokeWidth={4} opacity={1 - pulso} />
          )}
        </svg>
        <div style={{ position: "absolute", left: cx - 250, width: 500, top: cy + 90, textAlign: "center", fontFamily: MONO, fontWeight: 600 }}>
          <div style={{ fontSize: 110, color: ok ? COR.branco : COR.claro, letterSpacing: -2, textShadow: ok ? `0 0 30px ${COR.ciano}` : "none" }}>
            {(7.4 * p).toFixed(1).replace(".", ",")}
          </div>
          <div style={{ fontSize: 30, color: ok ? COR.verde : COR.suave, letterSpacing: 6, marginTop: -6 }}>{ok ? "N·m ✓" : "N·m"}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: v ? 90 : 960, top: v ? 1010 : 330, width: 900 }}>
        <Surge texto="Na linha de montagem," em={quando(ID, "Na", 0, 6) - 2} tamanho={v ? 54 : 60} peso={500} cor={COR.suave} intervalo={2} />
        <Surge texto="cada aperto conta." em={cada - 2} tamanho={v ? 124 : 132} intervalo={2} destaque={{ conta: COR.ciano }} style={{ marginTop: 18 }} />
        <div
          style={{
            marginTop: 34,
            height: 6,
            width: interpolate(f, [conta, conta + 12], [0, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
            background: `linear-gradient(90deg, ${COR.azul}, ${COR.ciano})`,
            borderRadius: 3,
          }}
        />
      </div>
      {tiques.map((t, i) => (
        <Sfx key={i} nome="tique" em={t} volume={0.25 + i * 0.02} />
      ))}
      <Sfx nome="pop" em={fim} volume={0.5} />
      <Sfx nome="swoosh" em={cada - 4} volume={0.35} />
    </AbsoluteFill>
  );
};
