import { AbsoluteFill, useCurrentFrame } from "remotion";
import { quando } from "../dados";
import { COR, MONO, SANS, useFormato } from "../tema";
import { Caixa, Conector, Defs, Glossario, Titulo } from "../componentes/Base";
import { Digital, Icone, NomeIcone } from "../componentes/Icones";
import { Sfx } from "../componentes/Som";

const ID = "arquitetura";
type Bloco = { t: string; s: string[]; ic: NomeIcone | "digital"; p: string };
const BLOCOS: Bloco[] = [
  { t: "Leitor biométrico", s: ["Sensor capacitivo", "DFRobot Gravity · 3,3 V"], ic: "digital", p: "leitor" },
  { t: "Raspberry Pi Pico W", s: ["Compara com as digitais salvas", "Firmware em C/C++"], ic: "chip", p: "Raspberry" },
  { t: "Relé automotivo 5 V", s: ["Interruptor comandado", "pelo microcontrolador"], ic: "rele", p: "relé" },
  { t: "Linha +15", s: ["Energia da ignição", "e da central (ECU)"], ic: "raio", p: "ignição" },
];
const ROTULOS = ["UART · 57.600 bps", "GPIO", "contato NA"];

export const Arquitetura = () => {
  const f = useCurrentFrame();
  const { v, W, H } = useFormato();
  const ems = BLOCOS.map((b, k) => quando(ID, b.p, 0, 40 + k * 40) - 6);
  const geo = v
    ? BLOCOS.map((_, k) => ({ x: 120, y: 470 + k * 210, w: 840, h: 150 }))
    : BLOCOS.map((_, k) => ({ x: 110 + k * 453, y: 360, w: 340, h: 230 }));
  return (
    <AbsoluteFill>
      <Titulo n={4} rotulo="Como funciona" texto="Quatro partes, uma decisão." style={{ position: "absolute", left: v ? 70 : 110, top: v ? 210 : 170, width: 1300 }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <Defs />
        {BLOCOS.slice(1).map((_, k) => {
          const a = geo[k];
          const b = geo[k + 1];
          const d = v ? `M ${a.x + 140} ${a.y + a.h} V ${b.y - 4}` : `M ${a.x + a.w} ${a.y + a.h / 2} H ${b.x - 4}`;
          return <Conector key={k} d={d} em={ems[k + 1] - 4} dur={12} sinal />;
        })}
      </svg>
      {ROTULOS.map((r, k) => {
        const a = geo[k];
        const b = geo[k + 1];
        const st: React.CSSProperties = v ? { left: a.x + 160, top: a.y + a.h + 18 } : { left: a.x + a.w + 6, top: a.y + a.h / 2 - 40, width: b.x - a.x - a.w - 12, textAlign: "center" };
        return (
          <div key={r} style={{ position: "absolute", fontFamily: MONO, fontSize: v ? 19 : 15, color: COR.destaque, opacity: f > ems[k + 1] + 8 ? 1 : 0, lineHeight: 1.2, ...st }}>
            {r}
          </div>
        );
      })}
      {BLOCOS.map((b, k) => {
        const g = geo[k];
        const ativo = f >= ems[k] && (k === 3 || f < ems[k + 1]);
        return (
          <Caixa key={b.t} em={ems[k]} ativo={ativo} style={{ position: "absolute", left: g.x, top: g.y, width: g.w, height: g.h, padding: v ? "22px 28px" : "26px 26px", display: "flex", flexDirection: v ? "row" : "column", gap: v ? 26 : 14, alignItems: v ? "center" : "flex-start" }}>
            {b.ic === "digital" ? <Digital tamanho={v ? 70 : 60} /> : <Icone nome={b.ic} tamanho={v ? 72 : 60} cor={COR.texto} />}
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: v ? 34 : 30, color: COR.texto }}>{b.t}</div>
              {b.s.map((s) => (
                <div key={s} style={{ fontFamily: SANS, fontSize: v ? 24 : 21, color: COR.suave, marginTop: 4 }}>{s}</div>
              ))}
            </div>
          </Caixa>
        );
      })}
      <div style={{ position: "absolute", left: v ? 70 : 110, top: v ? 1340 : 680, width: v ? 940 : 1700, display: "flex", flexDirection: "column", gap: v ? 16 : 14 }}>
        <Glossario em={ems[1] + 20} termo="UART" explica="comunicação em série: o leitor envia os dados da digital para a placa, fio a fio." />
        <Glossario em={ems[2] + 10} termo="RELÉ" explica="um interruptor acionado eletricamente; a placa liga e desliga sem tocar no circuito do carro." />
        <Glossario em={ems[3] + 6} termo="LINHA +15" explica="o fio que só recebe energia com a chave ligada; alimenta a injeção, a central e a ignição." />
      </div>
      {ems.map((e, k) => (
        <Sfx key={k} nome="tique" em={e + 4} volume={0.12} />
      ))}
    </AbsoluteFill>
  );
};
