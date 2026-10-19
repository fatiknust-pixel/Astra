import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { quando } from "../dados";
import { COR, MONO, SANS, entrada, useFormato } from "../tema";
import { Titulo } from "../componentes/Base";

const ID = "futuro";

export const Futuro = () => {
  const f = useCurrentFrame();
  const { v } = useFormato();
  const etapas = [
    { em: quando(ID, "placa", 0, 30) - 4, t: "Placa definitiva", d: "PCB com regulador 12 V → 5 V e fusível" },
    { em: quando(ID, "validação", 0, 50) - 4, t: "Validação no carro", d: "instalação no VW Gol 1994 da Fatec" },
    { em: quando(ID, "celular", 0, 70) - 4, t: "Liberação pelo celular", d: "Bluetooth/Wi-Fi do próprio Pico W" },
    { em: quando(ID, "celular", 0, 70) + 6, t: "Integração com a central", d: "comunicação direta pela rede CAN" },
  ];
  const fimLinha = interpolate(f, [etapas[0].em - 6, etapas[3].em + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Titulo n={11} rotulo="Próximos passos" texto="Do protótipo para o carro." style={{ position: "absolute", left: v ? 70 : 110, top: v ? 210 : 170, width: 1400 }} />
      {v ? (
        <div style={{ position: "absolute", left: 110, top: 470 }}>
          <div style={{ position: "absolute", left: 11, top: 12, width: 2, height: 3 * 240 * fimLinha, background: COR.linha }} />
          {etapas.map((e, k) => {
            const p = entrada(f, e.em, 14);
            return (
              <div key={k} style={{ position: "absolute", left: 0, top: k * 240, display: "flex", gap: 36, opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>
                <span style={{ width: 24, height: 24, borderRadius: 12, border: `3px solid ${COR.destaque}`, background: COR.fundo, flexShrink: 0 }} />
                <div style={{ width: 780 }}>
                  <div style={{ fontFamily: MONO, fontSize: 20, color: COR.destaque, letterSpacing: 2 }}>ETAPA {k + 1}</div>
                  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, color: COR.texto, marginTop: 6 }}>{e.t}</div>
                  <div style={{ fontFamily: SANS, fontSize: 26, color: COR.suave, marginTop: 6 }}>{e.d}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ position: "absolute", left: 110, top: 470, width: 1700 }}>
          <div style={{ position: "absolute", left: 12, top: 11, width: 1700 * 0.82 * fimLinha, height: 2, background: COR.linha }} />
          {etapas.map((e, k) => {
            const p = entrada(f, e.em, 14);
            return (
              <div key={k} style={{ position: "absolute", left: k * 440, top: 0, width: 400, opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>
                <span style={{ display: "block", width: 24, height: 24, borderRadius: 12, border: `3px solid ${COR.destaque}`, background: COR.fundo }} />
                <div style={{ fontFamily: MONO, fontSize: 19, color: COR.destaque, letterSpacing: 2, marginTop: 28 }}>ETAPA {k + 1}</div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, color: COR.texto, marginTop: 8 }}>{e.t}</div>
                <div style={{ fontFamily: SANS, fontSize: 25, color: COR.suave, marginTop: 8, lineHeight: 1.3 }}>{e.d}</div>
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
