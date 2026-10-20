import { evolvePath } from "@remotion/paths";
import { COR } from "../tema";

// Ícone do ASTRA (cantos de leitor + letra A), desenhado traço a traço com @remotion/paths
const CANTOS = [
  "M6 16V9a3 3 0 013-3h7",
  "M32 6h7a3 3 0 013 3v7",
  "M42 32v7a3 3 0 01-3 3h-7",
  "M16 42H9a3 3 0 01-3-3v-7",
];
const LETRA = ["M15.5 34L24 13.5 32.5 34", "M18.8 27h10.4"];

export const Marca: React.FC<{
  tamanho: number;
  cantos?: number; // 0..1 quanto dos cantos já foi desenhado
  letra?: number; // 0..1
  fundo?: number; // 0..1 opacidade do quadrado azul
  afastar?: number; // px que os cantos se afastam do centro (animação de "abrir")
  cor?: string;
}> = ({ tamanho, cantos = 1, letra = 1, fundo = 1, afastar = 0, cor = COR.branco }) => {
  const dir = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  return (
    <div style={{ width: tamanho, height: tamanho, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: tamanho * 0.22,
          background: `linear-gradient(145deg, #1A4B9C, ${COR.marinho})`,
          boxShadow: `0 ${tamanho * 0.12}px ${tamanho * 0.4}px rgba(47,107,255,0.45), inset 0 1px 0 rgba(255,255,255,0.25)`,
          opacity: fundo,
          transform: `scale(${0.6 + 0.4 * fundo})`,
        }}
      />
      <svg viewBox="0 0 48 48" width={tamanho} height={tamanho} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {CANTOS.map((d, i) => {
          const ev = evolvePath(Math.max(0.0001, cantos), d);
          const k = (afastar / tamanho) * 48;
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={cor}
              strokeWidth={3.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={ev.strokeDasharray}
              strokeDashoffset={ev.strokeDashoffset}
              transform={`translate(${dir[i][0] * k} ${dir[i][1] * k})`}
            />
          );
        })}
        {LETRA.map((d, i) => {
          const p = Math.min(1, Math.max(0.0001, letra * 1.6 - i * 0.6));
          const ev = evolvePath(p, d);
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={cor}
              strokeWidth={3.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={ev.strokeDasharray}
              strokeDashoffset={ev.strokeDashoffset}
            />
          );
        })}
      </svg>
    </div>
  );
};
