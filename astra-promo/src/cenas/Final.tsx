import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fimFala, quando } from "../dados";
import { COR, MONO, SANS, useFormato } from "../tema";
import { Marca } from "../componentes/Marca";
import { Sfx } from "../componentes/Som";

const ID = "final";

export const Final = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { v } = useFormato();
  const esc = quando(ID, "Escaneou", 0, 24);
  const res = quando(ID, "resolveu", 0, 36);
  const marca = spring({ frame: f - 2, fps, config: { damping: 14 } });
  const cantos = interpolate(f, [2, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const letra = interpolate(f, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s1 = spring({ frame: f - esc + 2, fps, config: { damping: 12, stiffness: 140 } });
  const s2 = spring({ frame: f - res + 2, fps, config: { damping: 10, stiffness: 140 } });
  const creditos = fimFala(ID) + 6;
  const sc = spring({ frame: f - creditos, fps, config: { damping: 20 } });
  const apaga = interpolate(f, [durationInFrames - 22, durationInFrames - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const brilho = interpolate(f - res, [0, 6, 30], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: v ? 420 : 150, display: "flex", flexDirection: v ? "column" : "row", alignItems: "center", justifyContent: "center", gap: v ? 30 : 40, transform: `scale(${0.85 + 0.15 * marca})`, opacity: marca }}>
        <Marca tamanho={v ? 190 : 170} cantos={cantos} letra={letra} fundo={marca} />
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: v ? 120 : 130, color: COR.branco, letterSpacing: v ? 22 : 26, marginRight: v ? -22 : 0 }}>ASTRA</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: v ? 900 : 430, display: "flex", flexDirection: v ? "column" : "row", alignItems: "center", justifyContent: "center", gap: v ? 0 : 36, fontFamily: SANS, fontWeight: 700, fontSize: v ? 132 : 124, letterSpacing: -2, lineHeight: 1.1 }}>
        <span style={{ color: COR.branco, opacity: s1, transform: `translateY(${(1 - s1) * 60}px) scale(${0.8 + 0.2 * s1})`, display: "inline-block" }}>Escaneou,</span>
        <span
          style={{
            color: COR.ciano,
            opacity: s2,
            transform: `translateY(${(1 - s2) * 60}px) scale(${0.8 + 0.2 * s2})`,
            display: "inline-block",
            textShadow: `0 0 ${20 + brilho * 50}px rgba(92,211,255,${0.4 + brilho * 0.5})`,
          }}
        >
          resolveu.
        </span>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: v ? 1270 : 660, textAlign: "center", opacity: sc, transform: `translateY(${(1 - sc) * 20}px)` }}>
        <div style={{ width: 120 * sc, height: 3, background: COR.claro, margin: "0 auto 30px", borderRadius: 2 }} />
        <div style={{ fontFamily: SANS, fontSize: v ? 36 : 34, color: COR.suave, lineHeight: 1.5 }}>
          Criado por <b style={{ color: COR.branco, fontWeight: 600 }}>Fabio Sarri</b>, <b style={{ color: COR.branco, fontWeight: 600 }}>Julia Freire</b> e{" "}
          <b style={{ color: COR.branco, fontWeight: 600 }}>João Paulo</b>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 20, color: COR.claro, opacity: 0.6, marginTop: 18, letterSpacing: 3 }}>PROTÓTIPO · DADOS FICTÍCIOS</div>
      </div>
      <AbsoluteFill style={{ background: "#000", opacity: apaga }} />
      <Sfx nome="pop" em={esc} volume={0.4} />
      <Sfx nome="whoosh" em={res - 3} volume={0.35} />
    </AbsoluteFill>
  );
};
