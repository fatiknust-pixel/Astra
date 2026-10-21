import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COR, MONO, SANS, entrada, useFormato } from "../tema";
import { Aparece, Cantos } from "../componentes/Base";
import { Marca } from "../componentes/Marca";
import { Sfx } from "../componentes/Som";

export const Final = () => {
  const f = useCurrentFrame();
  const { v } = useFormato();
  const tam = v ? 230 : 190;
  return (
    <AbsoluteFill style={{ background: COR.marinho, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ position: "relative", width: tam, height: tam, marginBottom: 70 }}>
        <Marca tamanho={tam} progresso={entrada(f, 2, 36)} fundo={false} />
        <Cantos x={0} y={0} w={tam} h={tam} em={30} cor={COR.claro} espessura={5} tam={44} />
      </div>
      <Aparece em={12}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: v ? 190 : 200, letterSpacing: v ? 10 : 16, color: COR.branco, lineHeight: 1 }}>ASTRA</div>
      </Aparece>
      <Aparece em={22}>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: v ? 58 : 60, color: COR.claro, marginTop: 28 }}>Escaneou, resolveu.</div>
      </Aparece>
      <Aparece em={42} style={{ marginTop: v ? 90 : 70 }}>
        <div style={{ fontFamily: SANS, fontSize: v ? 32 : 32, color: "rgba(255,255,255,0.78)", lineHeight: 1.5 }}>
          Criado por <b style={{ color: COR.branco, fontWeight: 600 }}>Fabio Sarri</b>, <b style={{ color: COR.branco, fontWeight: 600 }}>Julia Freire</b> e <b style={{ color: COR.branco, fontWeight: 600 }}>João Paulo</b>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 20, color: "rgba(255,255,255,0.45)", marginTop: 18, letterSpacing: 3 }}>PROTÓTIPO · DADOS FICTÍCIOS</div>
      </Aparece>
      <Sfx nome="swoosh" em={6} volume={0.12} />
    </AbsoluteFill>
  );
};
