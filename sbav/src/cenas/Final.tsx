import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import roteiro from "../../conteudo/roteiro.json";
import { fimFala } from "../dados";
import { COR, MONO, SANS, entrada, useFormato } from "../tema";
import { Aparece } from "../componentes/Base";
import { Digital } from "../componentes/Icones";

const ID = "final";

export const Final = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { v } = useFormato();
  const creditos = fimFala(ID) - 10;
  const apaga = interpolate(f, [durationInFrames - 24, durationInFrames - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: v ? 70 : 110, top: v ? 260 : 220, width: v ? 940 : 1000 }}>
        <Aparece em={4}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: v ? 150 : 150, color: COR.texto, letterSpacing: 9, lineHeight: 1 }}>SBAV</div>
        </Aparece>
        <Aparece em={12}>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: v ? 50 : 52, color: COR.texto, marginTop: 22 }}>
            A sua digital é <span style={{ color: COR.destaque }}>a chave do carro.</span>
          </div>
        </Aparece>
        <div style={{ width: 320 * entrada(f, creditos, 20), height: 3, background: COR.destaque, marginTop: 40 }} />
        <div style={{ marginTop: 34, opacity: entrada(f, creditos + 4, 18) }}>
          <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 2, color: COR.apagado, marginBottom: 14 }}>AUTORES</div>
          {roteiro.autores.map((a) => (
            <div key={a} style={{ fontFamily: SANS, fontSize: v ? 32 : 30, color: COR.texto, lineHeight: 1.5 }}>{a}</div>
          ))}
          <div style={{ fontFamily: MONO, fontSize: v ? 21 : 20, color: COR.suave, marginTop: 24, letterSpacing: 1, lineHeight: 1.6 }}>
            {roteiro.curso.toUpperCase()}
            <br />
            {roteiro.instituicao.toUpperCase()}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: v ? 540 - 160 : 1380, top: v ? 1180 : 300, opacity: 0.35 * entrada(f, 6, 30) }}>
        <Digital tamanho={v ? 320 : 380} />
      </div>
      <AbsoluteFill style={{ background: "#000", opacity: apaga }} />
    </AbsoluteFill>
  );
};
