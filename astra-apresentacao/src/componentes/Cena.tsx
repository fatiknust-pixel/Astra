import { useCurrentFrame } from "remotion";
import { COR, MONO, SANS, entrada, useFormato } from "../tema";
import { Marca } from "./Marca";

/** Painel azul do capítulo: número grande, rótulo e título. O conteúdo vai na área ao lado (ou abaixo). */
export const Capitulo: React.FC<{ n: number; rotulo: string; titulo: string }> = ({ n, rotulo, titulo }) => {
  const f = useCurrentFrame();
  const { v, H } = useFormato();
  const p = entrada(f, 2, 18);
  const q = entrada(f, 8, 20);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: v ? 1080 : 640, height: v ? 560 : H, background: COR.marinho, overflow: "hidden" }}>
      <div style={{ position: "absolute", right: v ? 50 : 40, top: v ? 20 : 40, fontFamily: SANS, fontWeight: 700, fontSize: v ? 300 : 360, lineHeight: 1, color: "rgba(255,255,255,0.07)", letterSpacing: -10, opacity: p }}>{String(n).padStart(2, "0")}</div>
      <div style={{ position: "absolute", left: v ? 70 : 80, right: 60, top: v ? 150 : 330, opacity: q, transform: `translateY(${(1 - q) * 18}px)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: COR.claro }}>{rotulo}</div>
        <div style={{ width: 64 * q, height: 4, background: COR.claro, margin: "22px 0 26px" }} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: v ? 76 : 70, lineHeight: 1.06, color: COR.branco, letterSpacing: -1.5 }}>{titulo}</div>
      </div>
      <div style={{ position: "absolute", left: v ? 70 : 80, bottom: v ? 40 : 56, display: "flex", alignItems: "center", gap: 16, opacity: 0.85 }}>
        <Marca tamanho={44} fundo={false} />
        <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 22, letterSpacing: 6, color: COR.branco }}>ASTRA</span>
      </div>
    </div>
  );
};
