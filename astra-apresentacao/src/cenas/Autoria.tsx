import { AbsoluteFill } from "remotion";
import { COR, SANS, useFormato } from "../tema";
import { Aparece } from "../componentes/Base";
import { quando } from "../dados";
import { Sfx } from "../componentes/Som";

export const Autoria = () => {
  const { v } = useFormato();
  const M = v ? 70 : 140;
  const nomes = [
    { n: "Fabio Sarri", em: quando("autoria", "Fabio", 0, 40), grande: true },
    { n: "Julia Freire", em: quando("autoria", "Julia", 0, 80) },
    { n: "João Paulo", em: quando("autoria", "João", 0, 110) },
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: M, top: v ? 520 : 230, width: v ? 940 : 1500 }}>
        <Aparece em={4}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: COR.marinho }}>Criado por</div>
          <div style={{ width: 72, height: 4, background: COR.marinho, margin: "22px 0 34px" }} />
        </Aparece>
        {nomes.map((x) => (
          <Aparece key={x.n} em={x.em - 6} style={{ marginBottom: v ? 14 : 8 }}>
            <div style={{ fontFamily: SANS, fontWeight: x.grande ? 700 : 600, fontSize: x.grande ? (v ? 150 : 170) : v ? 100 : 110, lineHeight: 1.05, letterSpacing: -3, color: x.grande ? COR.tinta : COR.suave }}>{x.n}</div>
          </Aparece>
        ))}
        <Aparece em={quando("autoria", "inteligência", 0, 170) - 10} style={{ marginTop: v ? 60 : 50 }}>
          <div style={{ fontFamily: SANS, fontSize: v ? 38 : 40, color: COR.suave, lineHeight: 1.35, maxWidth: v ? 900 : 1200 }}>com a inteligência artificial como parceira de desenvolvimento</div>
        </Aparece>
      </div>
      <Sfx nome="tique" em={14} volume={0.2} />
    </AbsoluteFill>
  );
};
