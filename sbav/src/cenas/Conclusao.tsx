import { AbsoluteFill } from "remotion";
import { quando } from "../dados";
import { COR, SANS, useFormato } from "../tema";
import { Caixa, Glossario, Titulo } from "../componentes/Base";
import { Icone, NomeIcone } from "../componentes/Icones";

const ID = "conclusao";

export const Conclusao = () => {
  const { v } = useFormato();
  const pecas = quando(ID, "peças", 0, 40) - 6;
  const custo = quando(ID, "custo", 0, 60) - 6;
  const antigos = quando(ID, "antigos", 0, 90) - 6;
  const itens: { em: number; ic: NomeIcone; t: string; d: string }[] = [
    { em: pecas, ic: "placa", t: "Peças acessíveis", d: "Componentes fáceis de encontrar no mercado." },
    { em: custo, ic: "dinheiro", t: "Baixo custo", d: "Sem modificar a estrutura do carro." },
    { em: antigos, ic: "carro", t: "Ideal para carros antigos", d: "Modelos sem imobilizador eletrônico de fábrica." },
  ];
  return (
    <AbsoluteFill>
      <Titulo n={10} rotulo="Conclusão" texto="Tecnicamente viável e de baixo custo." style={{ position: "absolute", left: v ? 70 : 110, top: v ? 210 : 170, width: 1400 }} />
      <div style={{ position: "absolute", left: v ? 70 : 110, top: v ? 470 : 380, display: "flex", flexDirection: v ? "column" : "row", gap: 30 }}>
        {itens.map((it) => (
          <Caixa key={it.t} em={it.em} style={{ width: v ? 940 : 545, padding: "32px 34px", display: "flex", flexDirection: v ? "row" : "column", gap: 22, alignItems: v ? "center" : "flex-start" }}>
            <Icone nome={it.ic} tamanho={64} cor={COR.destaque} />
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, color: COR.texto }}>{it.t}</div>
              <div style={{ fontFamily: SANS, fontSize: 26, color: COR.suave, marginTop: 8, lineHeight: 1.3 }}>{it.d}</div>
            </div>
          </Caixa>
        ))}
      </div>
      <div style={{ position: "absolute", left: v ? 70 : 110, top: v ? 1150 : 760, width: v ? 940 : 1700 }}>
        <Glossario em={custo + 24} termo="CONTRIBUIÇÃO" explica="o driver do sensor, reescrito do Arduino para o SDK nativo do Raspberry Pi Pico." />
      </div>
    </AbsoluteFill>
  );
};
