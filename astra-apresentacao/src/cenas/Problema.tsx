import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COR, MONO, SANS, SOMBRA, entrada, useArea, useFormato } from "../tema";
import { Capitulo } from "../componentes/Cena";
import { quando } from "../dados";
import { Sfx } from "../componentes/Som";

const FOLHAS = [
  { dx: 0.0, dy: 0.04, r: -5, t: "Posto PM4" },
  { dx: 0.3, dy: 0.0, r: 4, t: "Posto 14" },
  { dx: 0.08, dy: 0.34, r: 3, t: "Posto 10" },
  { dx: 0.4, dy: 0.38, r: -3, t: "Posto 02" },
];

export const Problema = () => {
  const f = useCurrentFrame();
  const { v } = useFormato();
  const a = useArea();
  const wf = v ? 520 : 440;
  const hf = v ? 400 : 330;
  const tPapeis = quando("problema", "papéis", 0, 60);
  const tMaq = quando("problema", "máquina", 0, 150);
  return (
    <AbsoluteFill>
      <Capitulo n={2} rotulo="O problema" titulo="Papéis espalhados, máquinas perdidas" />
      {FOLHAS.map((s, i) => {
        const p = entrada(f, tPapeis - 8 + i * 6, 18);
        return (
          <div key={s.t} style={{ position: "absolute", left: a.x + s.dx * (a.w - wf) * 1.6, top: a.y + s.dy * a.h * (v ? 1.25 : 1.1), width: wf, height: hf, background: COR.branco, borderRadius: 6, boxShadow: SOMBRA, transform: `rotate(${s.r}deg) translateY(${(1 - p) * -60}px)`, opacity: p, padding: "28px 32px", boxSizing: "border-box" }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, color: COR.marinho }}>{s.t}</div>
            {[0, 1, 2, 3, 4].map((k) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
                <div style={{ width: 170 + ((k * 53 + i * 31) % 120), height: 10, background: COR.papel2, borderRadius: 5 }} />
                <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 22, color: COR.apagado }}>{(3 + ((k * 7 + i * 5) % 14) + 0.5).toFixed(1).replace(".", ",")}</div>
              </div>
            ))}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: a.x + (v ? 120 : 330), top: a.y + (v ? 640 : 560), opacity: entrada(f, tMaq - 6, 14), transform: `rotate(-4deg) scale(${1.15 - 0.15 * entrada(f, tMaq - 6, 14)})` }}>
        <div style={{ border: `5px solid ${COR.vermelho}`, borderRadius: 12, padding: "16px 34px", background: "rgba(236,239,243,0.92)", fontFamily: SANS, fontWeight: 700, fontSize: v ? 44 : 46, color: COR.vermelho, letterSpacing: 2 }}>MÁQUINA 7 · NÃO ENCONTRADA</div>
      </div>
      <Sfx nome="tique" em={14} volume={0.2} />
    </AbsoluteFill>
  );
};
