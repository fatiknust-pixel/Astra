import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, MONO, SANS } from "../tema";
import { Marca } from "../componentes/Marca";
import { Sfx } from "../componentes/Som";

// Revelação da marca: cantos do leitor se desenham e fecham, a letra A aparece, ASTRA se espaça.
export const Revelacao = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fechar = spring({ frame: f - 2, fps, config: { damping: 14, stiffness: 70 } });
  const cantos = interpolate(f, [2, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const letra = interpolate(f, [20, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const fundo = spring({ frame: f - 34, fps, config: { damping: 12 } });
  const nome = "ASTRA";
  const espaco = interpolate(spring({ frame: f - 40, fps, config: { damping: 18, stiffness: 60 } }), [0, 1], [120, 28]);
  const sub = "Asset Tracking & Registration Application";
  const letrasSub = Math.round(interpolate(f, [62, 92], [0, sub.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const flash = interpolate(f, [0, 10], [0.9, 0], { extrapolateRight: "clamp" });
  const zoom = interpolate(f, [0, 180], [1.06, 1], { easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
      {/* anéis de energia */}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {[0, 1, 2].map((k) => {
          const t = interpolate(f - 34 - k * 6, [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          return t > 0 && t < 1 ? <circle key={k} cx={960} cy={400} r={150 + t * 700} fill="none" stroke={k === 1 ? COR.ciano : COR.claro} strokeWidth={4 - k} opacity={(1 - t) * 0.7} /> : null;
        })}
        {Array.from({ length: 16 }, (_, k) => {
          const a = (k / 16) * Math.PI * 2;
          const t = interpolate(f - 34, [0, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          if (t <= 0 || t >= 1) return null;
          const r1 = 170 + t * 260;
          const r2 = r1 + 60 * (1 - t);
          return <line key={k} x1={960 + r1 * Math.cos(a)} y1={400 + r1 * Math.sin(a)} x2={960 + r2 * Math.cos(a)} y2={400 + r2 * Math.sin(a)} stroke={COR.ciano} strokeWidth={4} strokeLinecap="round" opacity={1 - t} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 960 - 140, top: 400 - 140 }}>
        <Marca tamanho={280} cantos={cantos} letra={letra} fundo={fundo} afastar={(1 - fechar) * 260} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 150, color: COR.branco, letterSpacing: espaco, marginRight: -espaco, textShadow: "0 0 40px rgba(92,211,255,0.35)" }}>
          {nome.split("").map((l, i) => {
            const s = spring({ frame: f - 40 - i * 3, fps, config: { damping: 14 } });
            return (
              <span key={i} style={{ display: "inline-block", opacity: s, transform: `translateY(${(1 - s) * 40}px)`, filter: `blur(${(1 - s) * 10}px)` }}>
                {l}
              </span>
            );
          })}
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 30, color: COR.claro, letterSpacing: 4, marginTop: 6, height: 40 }}>
          {sub.slice(0, letrasSub)}
          {letrasSub < sub.length && letrasSub > 0 ? <span style={{ opacity: f % 10 < 5 ? 1 : 0 }}>▍</span> : null}
        </div>
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <Sfx nome="swoosh" em={36} volume={0.35} />
      {Array.from({ length: 6 }, (_, i) => (
        <Sfx key={i} nome="tecla" em={62 + i * 5} volume={0.25} />
      ))}
    </AbsoluteFill>
  );
};
