import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { quando } from "../dados";
import { COR, MONO, SANS, useFormato } from "../tema";
import { Rotulo, Surge } from "../componentes/Texto";
import { Sfx } from "../componentes/Som";

const ID = "inventario";
// Máquinas fictícias do protótipo, no estado das telas capturadas
const MAQ: [number, string, string, number, string, boolean][] = [
  [1, "SN-2024-0381", "6,5", 4, "12/03/2025", true],
  [2, "SN-2024-0402", "11", 2, "02/04/2025", true],
  [3, "SN-2023-1175", "8,8", 8, "20/11/2024", true],
  [4, "SN-2024-0519", "16", 6, "08/05/2025", false],
  [5, "SN-2023-0988", "4,5", 6, "30/09/2024", false],
  [6, "SN-2025-0034", "13", 3, "15/07/2025", true],
  [7, "SN-2024-0277", "9,5", 10, "22/01/2025", true],
  [8, "SN-2025-0121", "2,8", 1, "04/08/2025", false],
  [9, "SN-2023-0762", "18", 7, "14/10/2024", false],
  [10, "SN-2025-0188", "5,5", 9, "01/09/2025", false],
];
const COLS = ["Máquina", "Nº de série", "Torque (Nm)", "Posto", "No posto desde", "Situação"];
const LARG = [130, 220, 160, 100, 200, 190];

const arco = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos(((a - 90) * Math.PI) / 180), cy + r * Math.sin(((a - 90) * Math.PI) / 180)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};

export const Inventario = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { v, W, H } = useFormato();
  const quantas = 4;
  const copia = quando(ID, "direto", 0, 50) - 6;
  const excel = quando(ID, "Excel", 0, 70);
  const D = v ? { cx: 300, cy: 650, r: 150, w: 44 } : { cx: 470, cy: 470, r: 190, w: 52 };
  const p = interpolate(f, [quantas, quantas + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const verde = arco(D.cx, D.cy, D.r, 0, 179);
  const vermelho = arco(D.cx, D.cy, D.r, 181, 359.9);
  const ev1 = evolvePath(Math.max(0.0001, Math.min(1, p * 2)), verde);
  const ev2 = evolvePath(Math.max(0.0001, Math.max(0, p * 2 - 1)), vermelho);
  const enc = Math.round(5 * Math.min(1, p * 2));
  const nao = Math.round(5 * Math.max(0, p * 2 - 1));
  const painel = spring({ frame: f - copia + 12, fps, config: { damping: 18 } });
  const aperta = interpolate(f - copia, [0, 4, 10], [1, 0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const copiado = f >= copia + 6;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: v ? 60 : 170, top: v ? 200 : 130 }}>
        <Rotulo texto="05 · Inventário" em={2} />
      </div>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <circle cx={D.cx} cy={D.cy} r={D.r} stroke="rgba(141,178,245,0.14)" strokeWidth={D.w} fill="none" />
        <path d={verde} stroke={COR.verde} strokeWidth={D.w} fill="none" strokeDasharray={ev1.strokeDasharray} strokeDashoffset={ev1.strokeDashoffset} />
        <path d={vermelho} stroke={COR.vermelho} strokeWidth={D.w} fill="none" strokeDasharray={ev2.strokeDasharray} strokeDashoffset={ev2.strokeDashoffset} />
      </svg>
      <div style={{ position: "absolute", left: D.cx - 150, top: D.cy - 70, width: 300, textAlign: "center", fontFamily: SANS }}>
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 96, color: COR.branco, lineHeight: 1 }}>{enc}<span style={{ color: COR.suave, fontSize: 56 }}>/10</span></div>
        <div style={{ fontSize: 26, color: COR.suave, marginTop: 8 }}>encontradas</div>
      </div>
      <div style={{ position: "absolute", left: v ? 560 : 230, top: v ? 500 : 730, display: "flex", flexDirection: v ? "column" : "row", gap: v ? 20 : 30, fontFamily: SANS }}>
        {[
          [enc, "encontradas", COR.verde],
          [nao, "não encontradas", COR.vermelho],
        ].map(([n, t, c], i) => (
          <div key={i} style={{ padding: "16px 26px", borderRadius: 16, background: "rgba(13,30,64,0.75)", border: `1.5px solid ${c}66`, minWidth: 180, opacity: spring({ frame: f - quantas - i * 8, fps }) }}>
            <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 52, color: c as string }}>{n}</div>
            <div style={{ fontSize: 22, color: COR.suave }}>{t}</div>
          </div>
        ))}
      </div>
      {/* planilha */}
      <div style={{ position: "absolute", left: v ? 20 : 860, top: v ? 250 : 140, width: v ? 1040 : 1000 }}>
        <Surge texto="Lista pronta para o Excel." em={v ? 2 : copia - 12} tamanho={v ? 60 : 64} intervalo={2} style={v ? { marginLeft: 40 } : undefined} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: v ? 540 : 24, marginLeft: v ? 40 : 0 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: "#fff", background: copiado ? COR.verde : COR.azul, padding: "14px 30px", borderRadius: 12, transform: `scale(${aperta})`, boxShadow: `0 10px 30px ${copiado ? COR.verde : COR.azul}55`, opacity: painel }}>
            {copiado ? "✓ Lista copiada" : "Copiar lista"}
          </div>
        </div>
        <div style={{ marginTop: 26, borderRadius: 14, overflow: "hidden", background: "#FBFCFD", boxShadow: "0 30px 80px rgba(0,0,0,0.5)", opacity: painel, transform: `translateY(${(1 - painel) * 60}px)`, fontFamily: SANS }}>
          <div style={{ height: 44, background: "#E7ECF2", display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <span key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
            ))}
            <span style={{ marginLeft: 16, fontSize: 18, color: "#5A6576", fontWeight: 500 }}>inventario-maquinas</span>
          </div>
          <div style={{ display: "flex", background: "#F1F4F8", borderBottom: "1px solid #DCE2EA" }}>
            <span style={{ width: 40 }} />
            {LARG.map((w, i) => (
              <span key={i} style={{ width: w, textAlign: "center", fontFamily: MONO, fontSize: 15, color: "#7A8597", padding: "4px 0", borderLeft: "1px solid #DCE2EA" }}>{String.fromCharCode(65 + i)}</span>
            ))}
          </div>
          {[COLS, ...MAQ.map((m) => [String(m[0]), m[1], m[2], String(m[3]), m[4], m[5] ? "Encontrada" : "Não encontrada"])].map((linha, r) => {
            const em = copia + 6 + r;
            const vis = f >= em;
            return (
              <div key={r} style={{ display: "flex", borderBottom: "1px solid #E6EAF0", background: r === 0 ? "#EAF0FA" : "#fff", height: 38, alignItems: "center" }}>
                <span style={{ width: 40, textAlign: "center", fontFamily: MONO, fontSize: 15, color: "#7A8597" }}>{r + 1}</span>
                {linha.map((c, k) => (
                  <span
                    key={k}
                    style={{
                      width: LARG[k],
                      padding: "0 12px",
                      boxSizing: "border-box",
                      fontSize: 19,
                      fontWeight: r === 0 ? 600 : 400,
                      fontFamily: k === 1 && r > 0 ? MONO : SANS,
                      color: r > 0 && k === 5 ? (c === "Encontrada" ? "#13894F" : "#C9363B") : "#1A2433",
                      borderLeft: "1px solid #EEF1F5",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      opacity: vis ? 1 : 0,
                      transform: `translateY(${vis ? 0 : 6}px)`,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {Array.from({ length: 10 }, (_, i) => (
        <Sfx key={i} nome="tique" em={quantas + i * 2.6} volume={0.22} />
      ))}
      <Sfx nome="clique" em={copia} volume={0.55} />
      <Sfx nome="whoosh" em={copia + 6} volume={0.3} />
      <Sfx nome="sucesso" em={excel} volume={0.35} />
    </AbsoluteFill>
  );
};
