import { evolvePath } from "@remotion/paths";
import { COR } from "../tema";

// Ícones em traço fino (viewBox 48×48), estilo desenho técnico.
export const ICONE = {
  chave: "M14 30a7 7 0 1 1 0.1 0 M21 28h20 M35 28v6 M40 28v4",
  sinal: "M24 30v10 M18 40h12 M16 22a11 11 0 0 1 16 0 M11 17a18 18 0 0 1 26 0 M24 26a1 1 0 1 1 0.1 0",
  chip: "M14 14h20v20H14z M19 8v6 M24 8v6 M29 8v6 M19 34v6 M24 34v6 M29 34v6 M8 19h6 M8 24h6 M8 29h6 M34 19h6 M34 24h6 M34 29h6",
  rele: "M8 30h8 M16 30l14-8 M32 30h8 M30 30a1 1 0 1 1 0.1 0 M12 14h24v6H12z M24 20v6",
  motor: "M10 18h6v-4h10v4h6l4 4h4v12h-4l-4 4H16l-6-6z M20 26h8",
  check: "M12 25l8 8 16-17",
  bloqueio: "M15 22h18v16H15z M19 22v-5a5 5 0 0 1 10 0v5 M24 28v4",
  raio: "M26 6L14 27h10l-3 15 13-22H24z",
  celular: "M17 6h14a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z M22 37h4",
  placa: "M6 12h36v24H6z M12 18h8v6h-8z M26 18h10 M26 24h10 M12 30h24",
  carro: "M8 30l4-10h24l4 10 M6 30h36v6H6z M14 36v3 M34 36v3 M12 33h4 M32 33h4",
  dinheiro: "M8 14h32v20H8z M24 24a4 4 0 1 1 0.1 0 M12 18v0 M36 30v0",
  engrenagem: "M24 17a7 7 0 1 1-0.1 0 M24 6v5 M24 37v5 M6 24h5 M37 24h5 M11 11l4 4 M33 33l4 4 M37 11l-4 4 M15 33l-4 4",
} as const;

export type NomeIcone = keyof typeof ICONE;

export const Icone: React.FC<{ nome: NomeIcone; tamanho?: number; cor?: string; progresso?: number; espessura?: number }> = ({
  nome,
  tamanho = 48,
  cor = COR.texto,
  progresso = 1,
  espessura = 2,
}) => {
  const ev = evolvePath(Math.max(0.0001, progresso), ICONE[nome]);
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 48 48" style={{ display: "block", flexShrink: 0 }}>
      <path d={ICONE[nome]} fill="none" stroke={cor} strokeWidth={espessura * (48 / tamanho) * (tamanho / 48)} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
    </svg>
  );
};

/** Impressão digital em traço: arcos concêntricos que se desenham (progresso) e podem ser "varridos" (leitura). */
const arcos = (() => {
  const out: string[] = [];
  for (let k = 0; k < 11; k++) {
    const r = 8 + k * 7.2;
    const a0 = -200 + ((k * 37) % 40);
    const a1 = 20 - ((k * 23) % 50);
    const pts: string[] = [];
    for (let a = a0; a <= a1; a += 6) {
      const rad = (a * Math.PI) / 180;
      pts.push(`${(100 + r * Math.cos(rad)).toFixed(1)} ${(110 + r * 1.25 * Math.sin(rad)).toFixed(1)}`);
    }
    out.push("M" + pts.join(" L"));
    if (k > 2 && k % 2 === 0) {
      const b0 = a1 + 24;
      const b1 = a1 + 70;
      const q: string[] = [];
      for (let a = b0; a <= b1; a += 6) {
        const rad = (a * Math.PI) / 180;
        q.push(`${(100 + r * Math.cos(rad)).toFixed(1)} ${(110 + r * 1.25 * Math.sin(rad)).toFixed(1)}`);
      }
      out.push("M" + q.join(" L"));
    }
  }
  return out;
})();

export const Digital: React.FC<{ tamanho: number; progresso?: number; varredura?: number; cor?: string }> = ({ tamanho, progresso = 1, varredura = -1, cor = COR.texto }) => (
  <svg width={tamanho} height={tamanho * 1.1} viewBox="0 0 200 220" style={{ display: "block" }}>
    {arcos.map((d, i) => {
      const p = Math.min(1, Math.max(0.0001, progresso * 1.6 - i * 0.05));
      const ev = evolvePath(p, d);
      return <path key={i} d={d} fill="none" stroke={cor} strokeWidth={2.4} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} opacity={0.9} />;
    })}
    {varredura >= 0 && varredura <= 1 && (
      <g>
        <rect x={0} y={20 + varredura * 180 - 2} width={200} height={3} fill={COR.destaque} opacity={0.9} />
        <rect x={0} y={20 + varredura * 180 - 30} width={200} height={28} fill={COR.destaque} opacity={0.08} />
      </g>
    )}
  </svg>
);
