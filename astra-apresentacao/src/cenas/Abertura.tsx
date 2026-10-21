import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COR, MONO, SANS, entrada, useFormato } from "../tema";
import { Aparece, Cantos } from "../componentes/Base";
import { Marca } from "../componentes/Marca";
import { Sfx } from "../componentes/Som";

export const Abertura = () => {
  const f = useCurrentFrame();
  const { v, W } = useFormato();
  const desenho = entrada(f, 2, 40);
  const tam = v ? 190 : 160;
  return (
    <AbsoluteFill style={{ background: COR.marinho }}>
      <div style={{ position: "absolute", left: v ? 90 : 160, top: v ? 520 : 260 }}>
        <Marca tamanho={tam} progresso={desenho} fundo={false} />
      </div>
      <Cantos x={v ? 90 : 160} y={v ? 520 : 260} w={tam} h={tam} em={34} cor={COR.claro} espessura={5} tam={40} />
      <div style={{ position: "absolute", left: v ? 90 : 160, top: v ? 800 : 480, width: v ? 900 : 1500 }}>
        <Aparece em={14}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: v ? 250 : 260, letterSpacing: v ? 12 : 18, color: COR.branco, lineHeight: 1 }}>ASTRA</div>
        </Aparece>
        <Aparece em={26}>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: v ? 52 : 54, color: COR.claro, marginTop: 30, lineHeight: 1.2, maxWidth: v ? 860 : 1300 }}>Tabelas de torque e máquinas de aperto, a um QR Code de distância</div>
        </Aparece>
        <Aparece em={50}>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 22, color: "rgba(255,255,255,0.6)", marginTop: v ? 90 : 80, lineHeight: 1.8, letterSpacing: 1.5 }}>
            PROJETO · APRESENTAÇÃO
            <br />
            FABIO SARRI · JULIA FREIRE · JOÃO PAULO
          </div>
        </Aparece>
      </div>
      <span style={{ display: "none" }}>{W}</span>
      <Sfx nome="swoosh" em={8} volume={0.12} />
    </AbsoluteFill>
  );
};
