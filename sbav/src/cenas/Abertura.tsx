import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import roteiro from "../../conteudo/roteiro.json";
import { COR, MONO, SANS, entrada, useFormato } from "../tema";
import { Aparece } from "../componentes/Base";
import { Digital } from "../componentes/Icones";
import { Sfx } from "../componentes/Som";

export const Abertura = () => {
  const f = useCurrentFrame();
  const { v } = useFormato();
  const desenho = interpolate(f, [4, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const varre = f > 70 ? ((f - 70) % 70) / 70 : -1;
  const regua = entrada(f, 26, 24);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: v ? 540 - 200 : 1290, top: v ? 250 : 250 }}>
        <Digital tamanho={v ? 400 : 440} progresso={desenho} varredura={varre} />
      </div>
      <div style={{ position: "absolute", left: v ? 70 : 110, top: v ? 790 : 250, width: v ? 940 : 1050 }}>
        <Aparece em={10}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: v ? 170 : 180, color: COR.texto, letterSpacing: 10, lineHeight: 1 }}>SBAV</div>
        </Aparece>
        <Aparece em={18}>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: v ? 50 : 52, color: COR.texto, marginTop: 20, lineHeight: 1.15 }}>Sistema Biométrico de Autenticação Veicular</div>
        </Aparece>
        <div style={{ width: 320 * regua, height: 3, background: COR.destaque, marginTop: 34 }} />
        <Aparece em={34}>
          <div style={{ fontFamily: SANS, fontSize: v ? 32 : 32, color: COR.suave, marginTop: 30, lineHeight: 1.35 }}>Uma alternativa de segurança embarcada de baixo custo</div>
        </Aparece>
        <Aparece em={48}>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: v ? 22 : 22, color: COR.apagado, marginTop: v ? 70 : 90, lineHeight: 1.7, letterSpacing: 1 }}>
            TRABALHO DE CONCLUSÃO DE CURSO
            <br />
            {roteiro.curso.toUpperCase()}
            <br />
            {roteiro.instituicao.toUpperCase()}
          </div>
        </Aparece>
      </div>
      <Sfx nome="swoosh" em={8} volume={0.12} />
    </AbsoluteFill>
  );
};
