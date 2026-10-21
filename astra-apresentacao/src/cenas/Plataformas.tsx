import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { COR, SANS, SOMBRA, entrada, useArea, useFormato } from "../tema";
import { Capitulo } from "../componentes/Cena";
import { Celular, Tela } from "../componentes/Celular";
import { quando } from "../dados";
import { Sfx } from "../componentes/Som";

export const Plataformas = () => {
  const f = useCurrentFrame();
  const { v } = useFormato();
  const a = useArea();
  const lw = v ? 940 : 760;
  const lh = lw * (1200 / 1920);
  const pl = v ? 330 : 270;
  const tLap = quando("plataformas", "computador", 0, 120);
  const chips = [
    { t: "iPhone", em: quando("plataformas", "iPhone", 0, 40) },
    { t: "Android", em: quando("plataformas", "Android", 0, 80) },
    { t: "Computador", em: tLap },
    { t: "Sem internet", em: quando("plataformas", "internet", 0, 190) },
  ];
  const pc = entrada(f, tLap - 10, 22);
  return (
    <AbsoluteFill>
      <Capitulo n={9} rotulo="Onde funciona" titulo="No celular, no computador e offline" />
      <div style={{ position: "absolute", left: a.x, top: a.y + (v ? 40 : 30), width: lw, height: lh + 24, borderRadius: 14, background: "#0B1220", padding: "12px 12px 12px", boxSizing: "border-box", boxShadow: SOMBRA, opacity: pc, transform: `translateY(${(1 - pc) * 30}px)` }}>
        <Img src={staticFile("telas/pc-tabela.png")} style={{ width: "100%", height: "100%", borderRadius: 6, objectFit: "cover", objectPosition: "top" }} />
      </div>
      <Celular largura={pl} em={6} style={{ left: a.x + lw - pl + (v ? -10 : 60) - (v ? 0 : 0), top: a.y + (v ? 330 : 230) }}>
        <Tela src="tabela-posto-14" largura={pl} razao={2619 / 1170} rolagem={0.1} />
      </Celular>
      <div style={{ position: "absolute", left: a.x, top: a.y + (v ? 40 : 30) + lh + (v ? 70 : 60), display: "flex", flexWrap: "wrap", gap: 16, width: lw - pl - 40 }}>
        {chips.map((c) => {
          const p = entrada(f, c.em - 6, 16);
          const ativo = f >= c.em && f < c.em + 40;
          return (
            <div key={c.t} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, padding: "12px 24px", borderRadius: 40, background: ativo ? COR.marinho : COR.branco, color: ativo ? COR.branco : COR.tinta, border: `1.5px solid ${ativo ? COR.marinho : COR.linha}`, opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
              {c.t}
            </div>
          );
        })}
      </div>
      <Sfx nome="tique" em={14} volume={0.2} />
    </AbsoluteFill>
  );
};
