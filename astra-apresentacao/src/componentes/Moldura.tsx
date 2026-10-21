import { useCurrentFrame } from "remotion";
import { NARRACAO } from "../dados";
import roteiro from "../../conteudo/roteiro.json";
import { COR, useFormato } from "../tema";

/** Barra fina de progresso, uma divisão por cena, na borda inferior. */
export const Moldura = () => {
  const f = useCurrentFrame();
  const { H, W } = useFormato();
  const op = Math.min(1, f / 20) * Math.min(1, Math.max(0, (NARRACAO.total - f) / 20));
  return (
    <div style={{ position: "absolute", left: 0, top: H - 8, width: W, height: 8, display: "flex", gap: 3, opacity: op }}>
      {roteiro.cenas.map((c) => {
        const cena = NARRACAO.cenas[c.id];
        const p = Math.min(1, Math.max(0, (f - cena.inicio) / cena.quadros));
        return (
          <div key={c.id} style={{ flex: cena.quadros, background: "rgba(138,149,166,0.35)" }}>
            <div style={{ width: `${p * 100}%`, height: "100%", background: COR.claro }} />
          </div>
        );
      })}
    </div>
  );
};
