import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { quando } from "../dados";
import { COR, MONO, SANS } from "../tema";
import { Celular, Tela } from "../componentes/Celular";
import { Rotulo, Surge } from "../componentes/Texto";
import { Sfx } from "../componentes/Som";

const ID = "plataformas";
const WIFI = ["M10 30a40 40 0 0 1 56 0", "M20 41a25 25 0 0 1 36 0", "M30 52a11 11 0 0 1 16 0"];
const CORTE = "M12 14 L64 66";

export const Plataformas = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const iphone = quando(ID, "iPhone", 0, 20) - 6;
  const android = quando(ID, "Android", 0, 40) - 6;
  const pc = quando(ID, "computador", 0, 60) - 6;
  const internet = quando(ID, "internet", 0, 150);
  const abertura = quando(ID, "primeira", 0, internet - 30);
  const s1 = spring({ frame: f - iphone, fps, config: { damping: 15 } });
  const s2 = spring({ frame: f - android, fps, config: { damping: 15 } });
  const s3 = spring({ frame: f - pc, fps, config: { damping: 17 } });
  const off = spring({ frame: f - abertura, fps, config: { damping: 16 } });
  const corte = evolvePath(Math.max(0.0001, interpolate(f, [internet - 4, internet + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), CORTE);
  const selo = spring({ frame: f - internet - 8, fps, config: { damping: 11 } });
  const recua = interpolate(off, [0, 1], [1, 0.86]);
  const rotulo = (t: string, s: number) => (
    <div style={{ marginTop: 20, textAlign: "center", fontFamily: MONO, fontWeight: 600, fontSize: 26, letterSpacing: 4, color: COR.claro, opacity: s }}>{t}</div>
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Rotulo texto="06 · Em qualquer aparelho" em={2} />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${recua}) translateY(${(1 - recua) * 500}px)`, transformOrigin: "50% 100%", opacity: interpolate(off, [0, 1], [1, 0.22]), filter: `blur(${off * 4}px)` }}>
        {/* computador */}
        <div style={{ position: "absolute", left: 960 - 470, top: 190, width: 940, opacity: s3, transform: `translateY(${(1 - s3) * 120}px)` }}>
          <div style={{ background: "#141A24", borderRadius: "22px 22px 0 0", padding: 16, boxShadow: "0 40px 100px rgba(0,0,0,0.55), inset 0 0 0 2px rgba(255,255,255,0.08)" }}>
            <div style={{ borderRadius: 8, overflow: "hidden", height: 528, background: "#EEF1F4" }}>
              <Img src={staticFile("telas/pc-tabela.png")} style={{ width: "100%", display: "block" }} />
            </div>
          </div>
          <div style={{ height: 26, margin: "0 -60px", background: "linear-gradient(#C9D0DA, #8E97A5)", borderRadius: "0 0 26px 26px" }} />
          {rotulo("COMPUTADOR", s3)}
        </div>
        {/* iPhone */}
        <div style={{ position: "absolute", left: 250, top: 300, opacity: s1, transform: `translateY(${(1 - s1) * 200}px) rotate(${-6 * s1}deg)` }}>
          <Celular largura={270} brilho={0.3}>
            <Tela nome="escanear" />
          </Celular>
          {rotulo("IPHONE", s1)}
        </div>
        {/* Android */}
        <div style={{ position: "absolute", left: 1400, top: 300, opacity: s2, transform: `translateY(${(1 - s2) * 200}px) rotate(${6 * s2}deg)` }}>
          <Celular largura={270} brilho={0.3}>
            <Tela nome="maquinas" />
          </Celular>
          {rotulo("ANDROID", s2)}
        </div>
      </div>
      {/* sem internet */}
      {off > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center", opacity: off }}>
          <svg width={220} height={220} viewBox="0 0 76 76">
            <circle cx={38} cy={38} r={36} fill="rgba(7,22,52,0.9)" stroke={COR.linha} strokeWidth={1.5} />
            {WIFI.map((d, i) => (
              <path key={i} d={d} transform="translate(0 6)" stroke={COR.branco} strokeWidth={5} fill="none" strokeLinecap="round" />
            ))}
            <circle cx={38} cy={64} r={3.6} fill={COR.branco} />
            <path d={CORTE} stroke={COR.vermelho} strokeWidth={6} strokeLinecap="round" strokeDasharray={corte.strokeDasharray} strokeDashoffset={corte.strokeDashoffset} />
          </svg>
          <Surge texto="Sem internet? Funciona." em={internet + 2} tamanho={76} style={{ marginTop: 26, textAlign: "center" }} destaque={{ "Funciona": COR.verde }} />
          <div style={{ marginTop: 22, fontFamily: SANS, fontWeight: 600, fontSize: 30, color: COR.verde, border: `2px solid ${COR.verde}`, borderRadius: 999, padding: "10px 26px", background: "rgba(47,208,127,0.12)", opacity: selo, transform: `scale(${0.8 + 0.2 * selo})` }}>
            ✓ Depois da primeira abertura
          </div>
        </div>
      )}
      <Sfx nome="whoosh" em={iphone} volume={0.3} />
      <Sfx nome="whoosh" em={android} volume={0.3} />
      <Sfx nome="whoosh-desce" em={pc} volume={0.3} />
      <Sfx nome="glitch" em={internet - 2} volume={0.2} />
      <Sfx nome="sucesso" em={internet + 10} volume={0.4} />
    </AbsoluteFill>
  );
};
