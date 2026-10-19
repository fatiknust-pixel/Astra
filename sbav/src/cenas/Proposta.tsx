import { AbsoluteFill, useCurrentFrame } from "remotion";
import { quando } from "../dados";
import { COR, MONO, SANS, entrada, useFormato } from "../tema";
import { Caixa, Titulo } from "../componentes/Base";
import { Digital, Icone } from "../componentes/Icones";
import { Sfx } from "../componentes/Som";

const ID = "proposta";

export const Proposta = () => {
  const f = useCurrentFrame();
  const { v } = useFormato();
  const e1 = quando(ID, "motor", 0, 30) - 6;
  const e2 = quando(ID, "reconhece", 0, 50) - 6;
  const e3 = quando(ID, "cadastrado", 0, 70);
  const neg = quando(ID, "Se", 0, 100) - 4;
  const passos = [
    { em: e1, t: "Leitura", d: "O condutor encosta o dedo no leitor.", ic: "digital" as const },
    { em: e2, t: "Comparação", d: "A digital é comparada com as cadastradas.", ic: "chip" as const },
    { em: e3, t: "Partida liberada", d: "Só então a ignição recebe energia.", ic: "motor" as const },
  ];
  const w = v ? 940 : 500;
  return (
    <AbsoluteFill>
      <Titulo n={3} rotulo="A proposta" texto="O motor só liga depois de reconhecer a digital do condutor." style={{ position: "absolute", left: v ? 70 : 110, top: v ? 210 : 170, width: v ? 940 : 1400 }} />
      <div style={{ position: "absolute", left: v ? 70 : 110, top: v ? 600 : 470, display: "flex", flexDirection: v ? "column" : "row", alignItems: v ? "stretch" : "center", gap: v ? 18 : 0 }}>
        {passos.map((p, k) => (
          <div key={k} style={{ display: "flex", flexDirection: v ? "column" : "row", alignItems: "center" }}>
            <Caixa em={p.em} ativo={k === 2 && f > e3 + 10} cor={COR.verde} style={{ width: w, padding: "28px 32px", display: "flex", gap: 24, alignItems: "center" }}>
              <div style={{ width: 70, height: 76, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {p.ic === "digital" ? <Digital tamanho={64} progresso={entrada(f, p.em, 30)} /> : <Icone nome={p.ic} tamanho={68} cor={k === 2 ? COR.verde : COR.texto} progresso={entrada(f, p.em, 30)} />}
              </div>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 18, color: COR.apagado, letterSpacing: 2 }}>PASSO {k + 1}</div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, color: COR.texto, marginTop: 4 }}>{p.t}</div>
                <div style={{ fontFamily: SANS, fontSize: 25, color: COR.suave, marginTop: 6, lineHeight: 1.3 }}>{p.d}</div>
              </div>
            </Caixa>
            {k < 2 && (
              <div style={{ width: v ? 2 : 80, height: v ? 0 : 2, display: "flex", justifyContent: "center", opacity: entrada(f, passos[k + 1].em - 4, 10) }}>
                {!v && <svg width={80} height={20}><path d="M8 10 H66 M60 4 L70 10 L60 16" stroke={COR.suave} strokeWidth={2} fill="none" /></svg>}
              </div>
            )}
          </div>
        ))}
      </div>
      <Caixa em={neg} cor={COR.vermelho} ativo style={{ position: "absolute", left: v ? 70 : 110, top: v ? 1240 : 800, width: v ? 940 : 820, padding: "22px 30px", display: "flex", alignItems: "center", gap: 22 }}>
        <Icone nome="bloqueio" tamanho={54} cor={COR.vermelho} />
        <div style={{ fontFamily: SANS, fontSize: 29, color: COR.texto }}>
          Digital não reconhecida: <b style={{ color: COR.vermelho, fontWeight: 600 }}>a partida continua bloqueada.</b>
        </div>
      </Caixa>
      <Sfx nome="clique" em={e3 + 8} volume={0.18} />
    </AbsoluteFill>
  );
};
