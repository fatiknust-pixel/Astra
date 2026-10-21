import { useCurrentFrame } from "remotion";
import { cena, FPS } from "../dados";
import { COR, SANS, useFormato } from "../tema";

// Legenda simples, alinhada à esquerda e sem caixa: a palavra já falada fica em tinta, as próximas esmaecidas.
export const Legenda: React.FC<{ id: string }> = ({ id }) => {
  const f = useCurrentFrame();
  const { v, H } = useFormato();
  const c = cena(id);
  const t = (f - c.falaEm) / FPS;
  const grupos: { i: number; f: number; ws: typeof c.palavras }[] = [];
  let atual: typeof c.palavras = [];
  c.palavras.forEach((w, k) => {
    const prox = c.palavras[k + 1];
    atual.push(w);
    if (!prox || atual.length >= (v ? 6 : 9) || prox.i - w.f > 0.22) {
      grupos.push({ i: atual[0].i, f: atual[atual.length - 1].f, ws: atual });
      atual = [];
    }
  });
  const g = grupos.find((x, k) => t >= x.i - 0.1 && t < (grupos[k + 1]?.i ?? x.f + 0.5) - 0.1);
  if (!g) return null;
  return (
    <div style={{ position: "absolute", left: v ? 70 : 740, width: v ? 940 : 1070, top: H - (v ? 230 : 120), fontFamily: SANS, fontWeight: 500, fontSize: v ? 38 : 32, color: COR.apagado, lineHeight: 1.25 }}>
      {g.ws.map((w, k) => (
        <span key={k} style={{ color: t >= w.i - 0.05 ? COR.tinta : COR.apagado, marginRight: 10 }}>
          {w.p}
        </span>
      ))}
    </div>
  );
};
