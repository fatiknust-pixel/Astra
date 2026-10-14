import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import { evolvePath } from "@remotion/paths";
import { quando } from "../dados";
import { COR, MONO, SANS, useFormato } from "../tema";
import { Sfx } from "../componentes/Som";

const ID = "problema";

/** Texto com efeito de falha digital (separação RGB) nos primeiros quadros. */
const Falha: React.FC<{ texto: string; em: number; tamanho: number; cor?: string }> = ({ texto, em, tamanho, cor = COR.branco }) => {
  const f = useCurrentFrame();
  const t = f - em;
  if (t < 0) return null;
  const forte = interpolate(t, [0, 10], [1, 0], { extrapolateRight: "clamp" });
  const dx = noise2D("fx", t * 0.9, 0) * 22 * forte;
  const dy = noise2D("fy", 0, t * 0.9) * 6 * forte;
  const base: React.CSSProperties = { position: "absolute", left: 0, top: 0, fontFamily: SANS, fontWeight: 700, fontSize: tamanho, letterSpacing: -tamanho * 0.02, whiteSpace: "nowrap" };
  const corte = t < 8 && t % 3 === 0;
  return (
    <div style={{ position: "relative", height: tamanho * 1.15, opacity: Math.min(1, t / 3) }}>
      <div style={{ ...base, color: "#FF2E4D", transform: `translate(${dx}px, ${dy}px)`, opacity: 0.8 * forte, mixBlendMode: "screen" }}>{texto}</div>
      <div style={{ ...base, color: "#2EC9FF", transform: `translate(${-dx}px, ${-dy}px)`, opacity: 0.8 * forte, mixBlendMode: "screen" }}>{texto}</div>
      <div style={{ ...base, color: cor, clipPath: corte ? "inset(30% 0 35% 0)" : undefined, transform: corte ? `translateX(${dx * 1.5}px)` : undefined }}>{texto}</div>
    </div>
  );
};

/** Folha de papel com uma tabela rabiscada. */
const Folha: React.FC<{ i: number }> = ({ i }) => (
  <div style={{ width: 300, height: 390, background: i % 2 ? "#E9E6DC" : "#F3F1EA", borderRadius: 6, boxShadow: "0 18px 40px rgba(0,0,0,0.45)", padding: 26, boxSizing: "border-box" }}>
    <div style={{ height: 16, width: 150, background: "#B9B4A6", borderRadius: 3, marginBottom: 22 }} />
    {Array.from({ length: 8 }, (_, k) => (
      <div key={k} style={{ display: "flex", gap: 12, marginBottom: 17 }}>
        <div style={{ height: 10, flex: 1, background: "#D2CDBF", borderRadius: 2 }} />
        <div style={{ height: 10, width: 46, background: "#C7C1B1", borderRadius: 2 }} />
      </div>
    ))}
  </div>
);

// Ferramenta de aperto (parafusadeira) em traço
const FERRAMENTA = "M60 70 h170 a22 22 0 0 1 22 22 v36 a22 22 0 0 1 -22 22 h-60 l-22 120 a14 14 0 0 1 -14 12 h-40 a10 10 0 0 1 -10 -12 l18 -120 h-42 a22 22 0 0 1 -22 -22 v-36 a22 22 0 0 1 22 -22 z M252 102 h70 M322 92 v20";

export const Problema = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { v } = useFormato();
  const cade = quando(ID, "cadê", 0, 10);
  const segunda = quando(ID, "E", 0, 60);
  const maquina = quando(ID, "alguém", 0, segunda + 20) - 6;
  const sai = spring({ frame: f - segunda + 6, fps, config: { damping: 20 } });
  return (
    <AbsoluteFill>
      {/* folhas jogadas e embaralhando */}
      <div style={{ position: "absolute", left: v ? 390 : 420, top: v ? 820 : 330, transform: `translateX(${-sai * 900}px) rotate(${-sai * 12}deg)`, opacity: 1 - sai }}>
        {Array.from({ length: 6 }, (_, i) => {
          const s = spring({ frame: f - 2 - i * 3, fps, config: { damping: 12, stiffness: 130 } });
          const jx = noise2D("jx" + i, f * 0.02, 0) * 14;
          const jr = noise2D("jr" + i, 0, f * 0.02) * 4;
          const rot = (i % 2 ? 1 : -1) * (8 + i * 5);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: (i - 2.5) * 70 + jx,
                top: (i % 3) * 30 - (1 - s) * 700,
                transform: `rotate(${rot * s + jr}deg)`,
                opacity: s,
              }}
            >
              <Folha i={i} />
            </div>
          );
        })}
        {/* interrogação carimbada */}
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 60,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 260,
            color: COR.vermelho,
            textShadow: "0 10px 40px rgba(255,90,95,0.6)",
            transform: `scale(${spring({ frame: f - cade - 4, fps, config: { damping: 9 } })}) rotate(-8deg)`,
          }}
        >
          ?
        </div>
      </div>
      {/* máquina desaparecida */}
      {f >= segunda - 6 && (
        <div style={{ position: "absolute", left: v ? 310 : 160, top: v ? 760 : 300 }}>
          {[0, 1, 2].map((k) => {
            const t = ((f - segunda + k * 18) % 54) / 54;
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: 230 - 160 - t * 160,
                  top: 230 - 160 - t * 160,
                  width: 320 + t * 320,
                  height: 320 + t * 320,
                  borderRadius: "50%",
                  border: `3px solid ${COR.vermelho}`,
                  opacity: (1 - t) * 0.6,
                }}
              />
            );
          })}
          <svg width={460} height={460} viewBox="0 0 400 400" style={{ position: "relative" }}>
            <g transform="translate(20 40)">
              <path
                d={FERRAMENTA}
                fill="none"
                stroke={COR.claro}
                strokeWidth={6}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={evolvePath(Math.max(0.0001, interpolate(f, [segunda, segunda + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), FERRAMENTA).strokeDasharray}
                strokeDashoffset={evolvePath(Math.max(0.0001, interpolate(f, [segunda, segunda + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), FERRAMENTA).strokeDashoffset}
                opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 7))}
              />
            </g>
          </svg>
          <div
            style={{
              position: "absolute",
              left: 70,
              top: 470,
              fontFamily: MONO,
              fontWeight: 600,
              fontSize: 26,
              color: COR.vermelho,
              border: `3px solid ${COR.vermelho}`,
              padding: "8px 18px",
              borderRadius: 8,
              letterSpacing: 3,
              transform: `rotate(-4deg) scale(${spring({ frame: f - maquina - 6, fps, config: { damping: 10 } })})`,
            }}
          >
            NÃO ENCONTRADA
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: v ? 80 : 900, top: v ? 300 : 380, width: 960 }}>
        {f < segunda - 4 ? (
          <>
            <Falha texto="Cadê a tabela" em={cade - 6} tamanho={v ? 100 : 104} />
            <Falha texto="de torque?" em={cade + 4} tamanho={v ? 100 : 104} cor={COR.vermelho} />
          </>
        ) : (
          <>
            <Falha texto="E a máquina," em={segunda - 4} tamanho={v ? 100 : 104} />
            <Falha texto="alguém viu?" em={maquina + 6} tamanho={v ? 100 : 104} cor={COR.vermelho} />
          </>
        )}
      </div>
      <Sfx nome="glitch" em={cade - 6} volume={0.35} />
      <Sfx nome="whoosh" em={segunda - 10} volume={0.4} />
      <Sfx nome="glitch" em={segunda - 4} volume={0.3} />
      <Sfx nome="pop" em={maquina + 6} volume={0.45} />
    </AbsoluteFill>
  );
};
