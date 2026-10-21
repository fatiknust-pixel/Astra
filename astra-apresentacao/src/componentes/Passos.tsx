import { useCurrentFrame } from "remotion";
import { COR, SANS, SOMBRA, entrada, useFormato } from "../tema";

export type Passo = { nome: string; sub: string; em: number };

/** Lista de itens; o item em destaque acompanha a fala. */
export const Passos: React.FC<{ itens: Passo[]; esq: number; topo: number; largura: number; alto: number; vao?: number }> = ({ itens, esq, topo, largura, alto, vao = 18 }) => {
  const f = useCurrentFrame();
  const { v } = useFormato();
  const atual = itens.reduce((a, it, i) => (f >= it.em ? i : a), -1);
  return (
    <div style={{ position: "absolute", left: esq, top: topo, width: largura }}>
      {itens.map((it, i) => {
        const p = entrada(f, it.em - 8, 18);
        const ativo = i === atual;
        return (
          <div key={it.nome} style={{ height: alto, marginBottom: vao, padding: v ? "0 26px" : "0 34px", display: "flex", alignItems: "center", gap: 22, background: ativo ? COR.marinho : COR.branco, borderRadius: 14, boxShadow: ativo ? SOMBRA : "0 1px 3px rgba(15,26,43,0.10)", opacity: p, transform: `translateX(${(1 - p) * 40}px)`, boxSizing: "border-box" }}>
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: ativo ? COR.claro : COR.apagado, width: 38 }}>{i + 1}</span>
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: v ? 34 : 38, color: ativo ? COR.branco : COR.tinta, lineHeight: 1.1 }}>{it.nome}</div>
              <div style={{ fontFamily: SANS, fontSize: v ? 23 : 25, color: ativo ? "rgba(255,255,255,0.78)" : COR.suave, marginTop: 6 }}>{it.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
