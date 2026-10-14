import { interpolate } from "remotion";
import { noise2D } from "@remotion/noise";
import { COR, MONO } from "../tema";
import { Qr } from "./Qr";

// "Câmera" do celular apontada para a etiqueta com QR Code (desenhada, não filmada).
// f = quadro local; trava = quadro em que o leitor reconhece o código.
export const Camera: React.FC<{ f: number; texto: string; legenda: string; trava: number; fundo?: "posto" | "maquina" }> = ({
  f,
  texto,
  legenda,
  trava,
  fundo = "posto",
}) => {
  const mx = noise2D("cx", f * 0.03, 0) * 6;
  const my = noise2D("cy", 0, f * 0.03) * 5;
  const rot = noise2D("cr", f * 0.02, 1) * 1.2;
  const travado = f >= trava;
  const aperta = interpolate(f, [0, trava], [1.5, 1], { extrapolateRight: "clamp" });
  const linha = ((f * 7) % 260) - 130;
  const flash = interpolate(f - trava, [0, 3, 12], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const corCanto = travado ? COR.verde : "#FFFFFF";
  const cx = 195;
  const cy = 400;
  const meio = 120 * aperta;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#1B222D" }}>
      {/* cena atrás da etiqueta */}
      <div
        style={{
          position: "absolute",
          inset: -40,
          transform: `translate(${mx}px, ${my}px) rotate(${rot}deg)`,
          background:
            fundo === "posto"
              ? "linear-gradient(160deg, #39475C 0%, #222B38 40%, #2D3A4C 100%)"
              : "linear-gradient(160deg, #3A3F47 0%, #1E2228 55%, #4A3F2C 100%)",
        }}
      >
        {/* faixas e parafusos para parecer bancada/carcaça */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 18, background: "repeating-linear-gradient(45deg, #E2B33C 0 22px, #1B1B1B 22px 44px)", opacity: 0.55 }} />
        {[80, 330].map((x) => [200, 640].map((y) => (
          <div key={`${x}-${y}`} style={{ position: "absolute", left: x, top: y, width: 26, height: 26, borderRadius: 13, background: "radial-gradient(circle at 35% 35%, #9AA3AF, #3B424C)" }} />
        )))}
        <div
          style={{
            position: "absolute",
            left: cx + 40 - 125,
            top: cy + 40 - 120,
            width: 250,
            height: 300,
            background: "#F7F7F2",
            borderRadius: 14,
            boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 22,
            boxSizing: "border-box",
          }}
        >
          <Qr texto={texto} tamanho={196} fundo="#F7F7F2" />
          <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 20, marginTop: 14, color: "#0B2A5B", letterSpacing: 2 }}>{legenda}</div>
        </div>
      </div>
      {/* moldura do leitor */}
      <svg width={390} height={844} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="scan" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={COR.ciano} stopOpacity="0" />
            <stop offset="1" stopColor={COR.ciano} stopOpacity="0.85" />
          </linearGradient>
        </defs>
        {[
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
        ].map(([sx, sy], i) => {
          const x = cx + sx * meio;
          const y = cy + sy * meio;
          return (
            <path
              key={i}
              d={`M ${x} ${y - sy * 34} L ${x} ${y} L ${x - sx * 34} ${y}`}
              stroke={corCanto}
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
        {!travado && <rect x={cx - meio + 10} y={cy + linha * aperta * 0.85 - 40} width={meio * 2 - 20} height={40} fill="url(#scan)" />}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", fontFamily: "'IBM Plex Sans'", fontWeight: 600, fontSize: 17, color: "#fff" }}>
        <span style={{ background: travado ? COR.verde : "rgba(0,0,0,0.55)", padding: "8px 16px", borderRadius: 20 }}>
          {travado ? `✓ ${texto}` : "Procurando QR Code…"}
        </span>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
    </div>
  );
};
