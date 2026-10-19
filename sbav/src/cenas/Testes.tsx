import { AbsoluteFill, useCurrentFrame } from "remotion";
import { quando } from "../dados";
import { COR, MONO, SANS, entrada, useFormato } from "../tema";
import { Aparece, Caixa, Titulo } from "../componentes/Base";
import { Icone, NomeIcone } from "../componentes/Icones";
import { Sfx } from "../componentes/Som";

const ID = "testes";
// Critérios de aprovação definidos no artigo
const CRITERIOS: [string, string][] = [
  ["Reconhecimento correto", "≥ 95%"],
  ["Falsa aceitação", "0% (absoluto)"],
  ["Falsa rejeição", "≤ 10%"],
  ["Tempo de resposta", "< 1.500 ms"],
  ["Comutação do relé", "< 15 ms"],
  ["Rede CAN", "500 kbps"],
];

export const Testes = () => {
  const f = useCurrentFrame();
  const { v } = useFormato();
  const r1 = quando(ID, "todas", 0, 30) - 4;
  const r2 = quando(ID, "nenhuma", 0, 70) - 4;
  const r3 = quando(ID, "resposta", 0, 110) - 4;
  const res: { em: number; ic: NomeIcone; cor: string; t: string; d: string }[] = [
    { em: r1, ic: "check", cor: COR.verde, t: "Digitais cadastradas", d: "partida liberada em todas as tentativas" },
    { em: r2, ic: "bloqueio", cor: COR.vermelho, t: "Digitais não cadastradas", d: "nenhuma aceita: o bloqueio foi mantido" },
    { em: r3, ic: "raio", cor: COR.destaque, t: "Tempo de resposta", d: "abaixo de 1,5 segundo" },
  ];
  return (
    <AbsoluteFill>
      <Titulo n={9} rotulo="Testes" texto="Resultados em bancada." style={{ position: "absolute", left: v ? 70 : 110, top: v ? 210 : 170, width: 1400 }} />
      <div style={{ position: "absolute", left: v ? 70 : 110, top: v ? 430 : 360, width: v ? 940 : 900, display: "flex", flexDirection: "column", gap: 18 }}>
        {res.map((r) => (
          <Caixa key={r.t} em={r.em} ativo={f > r.em + 8} cor={r.cor} style={{ padding: "22px 28px", display: "flex", gap: 24, alignItems: "center" }}>
            <Icone nome={r.ic} tamanho={56} cor={r.cor} progresso={entrada(f, r.em + 4, 16)} espessura={2.6} />
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: COR.texto }}>{r.t}</div>
              <div style={{ fontFamily: SANS, fontSize: 26, color: COR.suave, marginTop: 4 }}>{r.d}</div>
            </div>
          </Caixa>
        ))}
      </div>
      <Caixa em={10} style={{ position: "absolute", left: v ? 70 : 1080, top: v ? 970 : 360, width: v ? 940 : 730, padding: "22px 28px" }}>
        <div style={{ fontFamily: MONO, fontSize: 19, letterSpacing: 2, color: COR.suave, marginBottom: 12 }}>CRITÉRIOS DE APROVAÇÃO</div>
        {CRITERIOS.map(([a, b], k) => (
          <div key={a} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderTop: k ? `1px solid ${COR.linha}` : "none", opacity: entrada(f, 16 + k * 5, 12) }}>
            <span style={{ fontFamily: SANS, fontSize: 25, color: COR.texto }}>{a}</span>
            <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 24, color: COR.destaque }}>{b}</span>
          </div>
        ))}
      </Caixa>
      <Aparece em={r3 + 30} style={{ position: "absolute", left: v ? 70 : 110, top: v ? 1490 : 840, width: v ? 940 : 1700, fontFamily: SANS, fontSize: 23, color: COR.apagado, lineHeight: 1.4 }}>
        As únicas falhas de leitura vieram de sujeira na ponta do dedo, um limite do sensor capacitivo.
      </Aparece>
      <Sfx nome="clique" em={r1 + 6} volume={0.14} />
      <Sfx nome="clique" em={r2 + 6} volume={0.14} />
    </AbsoluteFill>
  );
};
