import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useArea, useFormato } from "../tema";
import { Capitulo } from "./Cena";
import { Celular, Tela } from "./Celular";
import { Passos, Passo } from "./Passos";
import { Sfx } from "./Som";

export type TelaApp = { src: string; em: number; razao?: number; rolar?: [number, number, number]; };

/** Capítulo padrão: celular com as telas do app (uma troca pela outra) e a lista de pontos ao lado. */
export const CenaTelas: React.FC<{ n: number; rotulo: string; titulo: string; telas: TelaApp[]; itens: Passo[] }> = ({ n, rotulo, titulo, telas, itens }) => {
  const f = useCurrentFrame();
  const { v } = useFormato();
  const a = useArea();
  const lar = v ? 440 : 350;
  const altoItem = v ? 220 : 150;
  return (
    <AbsoluteFill>
      <Capitulo n={n} rotulo={rotulo} titulo={titulo} />
      <Celular largura={lar} em={6} style={{ left: a.x, top: a.y }}>
        {telas.map((t, i) => {
          const prox = telas[i + 1]?.em ?? 99999;
          const x0 = t.em - 8, x1 = x0 + 14, x2 = Math.max(x1 + 1, prox - 6), x3 = x2 + 12;
          const op = interpolate(f, [x0, x1, x2, x3], [i === 0 ? 1 : 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const rol = t.rolar ? interpolate(f, [t.em + t.rolar[2] * 0, t.em + t.rolar[2]], [t.rolar[0], t.rolar[1]], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
          return <Tela key={t.src + i} src={t.src} largura={lar} razao={t.razao} rolagem={rol} opacidade={i === telas.length - 1 ? Math.max(op, f >= t.em ? 1 : 0) : op} />;
        })}
      </Celular>
      <Passos itens={itens} esq={a.x + lar + (v ? 40 : 70)} topo={a.y + (v ? 40 : 40)} largura={a.w - lar - (v ? 40 : 70)} alto={altoItem} vao={v ? 22 : 22} />
      <Sfx nome="tique" em={14} volume={0.2} />
    </AbsoluteFill>
  );
};
