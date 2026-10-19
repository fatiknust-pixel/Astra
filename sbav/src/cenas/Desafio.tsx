import { AbsoluteFill, useCurrentFrame } from "remotion";
import { quando } from "../dados";
import { COR, MONO, SANS, entrada, useFormato } from "../tema";
import { Caixa, Glossario, Titulo } from "../componentes/Base";
import { Sfx } from "../componentes/Som";

const ID = "desafio";
// Exemplos citados no artigo: as funções do Arduino e as equivalentes no SDK do Pico
const PARES: [string, string[]][] = [
  ["Serial.begin(57600);", ["uart_init(uart0, 57600);", "gpio_set_function(0, GPIO_FUNC_UART);"]],
  ["delay(200);", ["sleep_ms(200);"]],
  ["millis();", ["time_us_64() / 1000;"]],
];

const Painel: React.FC<{ titulo: string; em: number; linhas: { t: string; em: number; cor: string }[]; style?: React.CSSProperties }> = ({ titulo, em, linhas, style }) => {
  const f = useCurrentFrame();
  const { v } = useFormato();
  return (
    <Caixa em={em} style={{ padding: 0, overflow: "hidden", ...style }}>
      <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COR.linha}`, fontFamily: MONO, fontSize: 19, color: COR.suave, letterSpacing: 1 }}>{titulo}</div>
      <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {linhas.map((l, k) => (
          <div key={k} style={{ fontFamily: MONO, fontWeight: 500, fontSize: v ? 24 : 25, color: l.cor, opacity: entrada(f, l.em, 10), whiteSpace: "nowrap" }}>
            {l.t}
          </div>
        ))}
      </div>
    </Caixa>
  );
};

export const Desafio = () => {
  const { v } = useFormato();
  const ini = quando(ID, "programa", 0, 20) - 4;
  const reescreveu = quando(ID, "reescreveu", 0, 90) - 6;
  const esq = PARES.map(([a], k) => ({ t: a, em: ini + 8 + k * 6, cor: COR.suave }));
  const dir = PARES.flatMap(([, b], k) => b.map((t, j) => ({ t, em: reescreveu + k * 10 + j * 4, cor: COR.texto })));
  return (
    <AbsoluteFill>
      <Titulo n={7} rotulo="O desafio" texto="Adaptar o programa do leitor para outra placa." style={{ position: "absolute", left: v ? 70 : 110, top: v ? 210 : 170, width: 1400 }} />
      <div style={{ position: "absolute", left: v ? 70 : 110, top: v ? 560 : 400, display: "flex", flexDirection: v ? "column" : "row", gap: v ? 26 : 40, alignItems: "stretch" }}>
        <Painel titulo="ANTES · Arduino (C++)" em={ini} linhas={esq} style={{ width: v ? 940 : 640 }} />
        <Painel titulo="DEPOIS · Raspberry Pi Pico SDK (C)" em={reescreveu - 6} linhas={dir} style={{ width: v ? 940 : 1020 }} />
      </div>
      <div style={{ position: "absolute", left: v ? 70 : 110, top: v ? 1240 : 770, width: v ? 940 : 1700, display: "flex", flexDirection: "column", gap: 12 }}>
        <Glossario em={reescreveu + 30} termo="SDK" explica="o kit oficial de ferramentas para programar o Pico, em C, sem as bibliotecas prontas do Arduino." />
        <Glossario em={reescreveu + 42} termo="RESULTADO" explica="um driver próprio para o sensor, que pode ser reutilizado em outros projetos." />
      </div>
      <Sfx nome="tecla" em={reescreveu} volume={0.12} />
      <Sfx nome="tecla" em={reescreveu + 10} volume={0.12} />
      <Sfx nome="tecla" em={reescreveu + 20} volume={0.12} />
    </AbsoluteFill>
  );
};
