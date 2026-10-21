import { Img, staticFile, useCurrentFrame } from "remotion";
import { COR, SOMBRA, entrada } from "../tema";

const RAZAO = 2532 / 1170;
export const alturaCelular = (largura: number) => (largura - 20) * RAZAO + 20;

/** Moldura de celular com a tela real do aplicativo. */
export const Celular: React.FC<{ largura: number; em: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ largura, em, style, children }) => {
  const f = useCurrentFrame();
  const p = entrada(f, em, 22);
  return (
    <div style={{ position: "absolute", width: largura, height: alturaCelular(largura), borderRadius: 46, background: "#0B1220", padding: 10, boxSizing: "border-box", boxShadow: SOMBRA, opacity: p, transform: `translateY(${(1 - p) * 34}px)`, ...style }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 36, overflow: "hidden", background: COR.papel }}>{children}</div>
    </div>
  );
};

/** Captura de tela. Se for mais alta que a tela do celular, `rolagem` (0 a 1) a percorre de cima para baixo. */
export const Tela: React.FC<{ src: string; largura: number; razao?: number; rolagem?: number; opacidade?: number }> = ({ src, largura, razao = RAZAO, rolagem = 0, opacidade = 1 }) => {
  const larg = largura - 20;
  const alto = larg * razao;
  const vista = larg * RAZAO;
  return <Img src={staticFile(`telas/${src}.png`)} style={{ position: "absolute", left: 0, top: -Math.max(0, alto - vista) * rolagem, width: "100%", height: alto, opacity: opacidade }} />;
};
