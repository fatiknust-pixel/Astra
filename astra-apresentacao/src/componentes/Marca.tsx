import { evolvePath } from "@remotion/paths";
import { COR } from "../tema";

// Ícone do ASTRA (cantos de leitor + letra A), liso, desenhado traço a traço.
const CANTOS = ["M6 16V9a3 3 0 013-3h7", "M32 6h7a3 3 0 013 3v7", "M42 32v7a3 3 0 01-3 3h-7", "M16 42H9a3 3 0 01-3-3v-7"];
const LETRA = ["M15.5 34L24 13.5 32.5 34", "M18.8 27h10.4"];

export const Marca: React.FC<{ tamanho: number; progresso?: number; fundo?: boolean; cor?: string }> = ({ tamanho, progresso = 1, fundo = true, cor = COR.branco }) => (
  <div style={{ width: tamanho, height: tamanho, position: "relative" }}>
    {fundo && <div style={{ position: "absolute", inset: 0, borderRadius: tamanho * 0.22, background: COR.marinho, opacity: Math.min(1, progresso * 3) }} />}
    <svg viewBox="0 0 48 48" width={tamanho} height={tamanho} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {[...CANTOS, ...LETRA].map((d, i) => {
        const ev = evolvePath(Math.min(1, Math.max(0.0001, progresso * 1.4 - (i / 6) * 0.4)), d);
        return <path key={i} d={d} fill="none" stroke={cor} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />;
      })}
    </svg>
  </div>
);
