import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COR, entrada } from "../tema";

/** Fundo liso, sem textura nem padrão. */
export const Fundo = () => <AbsoluteFill style={{ background: COR.papel }} />;

/** Elemento que surge (opacidade + leve subida). */
export const Aparece: React.FC<{ em: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties; desloca?: number }> = ({ em, dur = 16, children, style, desloca = 16 }) => {
  const f = useCurrentFrame();
  const p = entrada(f, em, dur);
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * desloca}px)`, ...style }}>{children}</div>;
};

/** Os quatro cantos do leitor (motivo da marca) que fecham em volta do que está sendo lido. */
export const Cantos: React.FC<{ x: number; y: number; w: number; h: number; em: number; cor?: string; espessura?: number; tam?: number }> = ({ x, y, w, h, em, cor = COR.marinho, espessura = 6, tam = 56 }) => {
  const f = useCurrentFrame();
  const p = entrada(f, em, 18);
  const o = (1 - p) * 40;
  const c = (extra: React.CSSProperties) => <div style={{ position: "absolute", width: tam, height: tam, borderColor: cor, borderStyle: "solid", borderWidth: 0, borderRadius: 10, opacity: p, ...extra }} />;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {c({ left: -o, top: -o, borderTopWidth: espessura, borderLeftWidth: espessura })}
      {c({ right: -o, top: -o, borderTopWidth: espessura, borderRightWidth: espessura })}
      {c({ right: -o, bottom: -o, borderBottomWidth: espessura, borderRightWidth: espessura })}
      {c({ left: -o, bottom: -o, borderBottomWidth: espessura, borderLeftWidth: espessura })}
    </div>
  );
};
