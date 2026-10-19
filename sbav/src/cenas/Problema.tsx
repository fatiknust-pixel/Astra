import { AbsoluteFill } from "remotion";
import { quando } from "../dados";
import { COR, SANS, useFormato } from "../tema";
import { Aparece, Caixa, Titulo } from "../componentes/Base";
import { Icone, NomeIcone } from "../componentes/Icones";

const ID = "problema";
const ITENS: { i: NomeIcone; t: string; d: string; p: string }[] = [
  { i: "chave", t: "Chave copiada", d: "Cópia ou clonagem da chave original.", p: "chaves" },
  { i: "sinal", t: "Abertura à distância", d: "Aparelhos que imitam o sinal do controle remoto.", p: "aparelhos" },
];

export const Problema = () => {
  const { v } = useFormato();
  return (
    <AbsoluteFill>
      <Titulo n={2} rotulo="O problema" texto="Alarmes e travas evoluíram, mas as brechas continuam." style={{ position: "absolute", left: v ? 70 : 110, top: v ? 210 : 170, width: v ? 940 : 1300 }} />
      <div style={{ position: "absolute", left: v ? 70 : 110, top: v ? 620 : 520, display: "flex", flexDirection: v ? "column" : "row", gap: 36 }}>
        {ITENS.map((it) => (
          <Caixa key={it.t} em={quando(ID, it.p, 0, 40) - 6} style={{ width: v ? 940 : 600, padding: "38px 40px", display: "flex", gap: 30, alignItems: "flex-start" }}>
            <Icone nome={it.i} tamanho={76} cor={COR.destaque} />
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 38, color: COR.texto }}>{it.t}</div>
              <div style={{ fontFamily: SANS, fontSize: 28, color: COR.suave, marginTop: 10, lineHeight: 1.35 }}>{it.d}</div>
            </div>
          </Caixa>
        ))}
      </div>
      <Aparece em={quando(ID, "aparelhos", 0, 60) + 24} style={{ position: "absolute", left: v ? 70 : 110, top: v ? 1180 : 860, fontFamily: SANS, fontSize: 28, color: COR.apagado }}>
        Os dois métodos dependem da chave ou do sinal, e não de quem está dirigindo.
      </Aparece>
    </AbsoluteFill>
  );
};
