import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { MARCAS, quando } from "../dados";
import { COR, SANS } from "../tema";
import { Celular, Destaque, Tela, Toque } from "../componentes/Celular";
import { Ficha, Rotulo, Surge } from "../componentes/Texto";
import { Sfx } from "../componentes/Som";
import { CEL } from "./Escanear";

const ID = "alterar";
const CHECK = "M14 32 l12 12 l24 -26";

// Senha -> formulário -> situação muda de "Não encontrada" para "Encontrada"
export const Alterar = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const senha = quando(ID, "senha", 0, 40);
  const digita = [senha - 8, senha - 3, senha + 2, senha + 7];
  const entrar = senha + 14;
  const form = entrar + 6;
  const troca = form + 22;
  const salvar = troca + 16;
  const pronto = salvar + 8;
  const pw = MARCAS["senha"].el["#pw"][0];
  const ok = MARCAS["senha"].el["[data-act=pwok]"][0];
  const st = MARCAS["formulario"].el["#f-status"][0];
  const sv = MARCAS["formulario"].el["[data-act=savem]"][0];
  const rolagem = 49;
  const formEntra = spring({ frame: f - form, fps, config: { damping: 20, stiffness: 140 } });
  const fim = spring({ frame: f - pronto, fps, config: { damping: 20, stiffness: 140 } });
  const vira = spring({ frame: f - pronto - 4, fps, config: { damping: 12, stiffness: 90 } });
  const ev = evolvePath(Math.max(0.0001, interpolate(f, [pronto + 12, pronto + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), CHECK);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: CEL.x, top: CEL.y }}>
        <Celular largura={CEL.largura} rotY={-4} rotX={4}>
          <Tela nome="senha">
            {digita.map((t, i) =>
              f >= t ? <div key={i} style={{ position: "absolute", left: pw[0] + 16 + i * 18, top: pw[1] + pw[3] / 2 - 5, width: 10, height: 10, borderRadius: 5, background: "#111" }} /> : null,
            )}
            <Toque x={ok[0] + ok[2] / 2} y={ok[1] + ok[3] / 2} t={f - entrar} />
          </Tela>
          <Tela nome="formulario" rolagem={rolagem} style={{ transform: `translateX(${(1 - formEntra) * 390}px)` }}>
            {f >= troca && (
              <div style={{ position: "absolute", left: st[0] + 2, top: st[1] + 2, width: st[2] - 40, height: st[3] - 4, background: "#fff", display: "flex", alignItems: "center", paddingLeft: 12, fontFamily: SANS, fontSize: 16, color: "#111", borderRadius: 8 }}>
                Encontrada
              </div>
            )}
            <Destaque r={st} p={interpolate(f, [troca - 6, troca], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (f < salvar ? 1 : 0)} cor={COR.verde} raio={10} />
            <Toque x={st[0] + st[2] / 2} y={st[1] + st[3] / 2} t={f - troca + 4} />
            <Toque x={sv[0] + sv[2] / 2} y={sv[1] + sv[3] / 2} t={f - salvar} />
          </Tela>
          <Tela nome="maquina-7-encontrada" style={{ opacity: fim, transform: `scale(${0.96 + 0.04 * fim})` }}>
            <Destaque r={MARCAS["maquina-7-encontrada"].el[".plate dd"][4]} p={fim} cor={COR.verde} raio={6} folga={3} />
          </Tela>
        </Celular>
      </div>
      <div style={{ position: "absolute", left: 900, top: 190, width: 960 }}>
        <Rotulo texto="03 · Alterar dados" em={4} />
        <Surge texto="Precisa atualizar?" em={quando(ID, "Precisa", 0, 16) - 2} tamanho={86} style={{ marginTop: 26 }} />
        <div style={{ marginTop: 34, display: "flex", gap: 18 }}>
          <Ficha texto="Protegido por senha" em={senha - 6} cor={COR.ambar} />
        </div>
      </div>
      {/* selo virando */}
      <div style={{ position: "absolute", left: 900, top: 560 }}>
        <div style={{ fontFamily: SANS, fontSize: 26, fontWeight: 600, color: COR.suave, letterSpacing: 3, marginBottom: 16, opacity: spring({ frame: f - troca, fps }) }}>SITUAÇÃO DA MÁQUINA 7</div>
        {/* giro em 2D (escala vertical), que continua certo durante as transições entre cenas */}
        <div style={{ position: "relative", width: 640, height: 130, opacity: spring({ frame: f - troca, fps }), transform: `scaleY(${Math.abs(Math.cos(vira * Math.PI))})` }}>
          {vira < 0.5 ? (
            <Selo texto="Não encontrada" cor={COR.vermelho} />
          ) : (
            <Selo texto="Encontrada" cor={COR.verde} icone={<svg width={64} height={64} viewBox="0 0 64 64"><path d={CHECK} stroke={COR.verde} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} /></svg>} />
          )}
        </div>
        <Surge texto="Atualizado em segundos." em={pronto + 16} tamanho={48} peso={600} cor={COR.ciano} style={{ marginTop: 40 }} />
      </div>
      {digita.map((t, i) => (
        <Sfx key={i} nome="tecla" em={t} volume={0.45} />
      ))}
      <Sfx nome="clique" em={entrar} volume={0.5} />
      <Sfx nome="whoosh" em={form - 2} volume={0.25} />
      <Sfx nome="clique" em={troca - 4} volume={0.45} />
      <Sfx nome="clique" em={salvar} volume={0.5} />
      <Sfx nome="sucesso" em={pronto + 6} volume={0.5} />
    </AbsoluteFill>
  );
};

const Selo: React.FC<{ texto: string; cor: string; icone?: React.ReactNode }> = ({ texto, cor, icone }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: 999,
      border: `4px solid ${cor}`,
      background: `${cor}22`,
      boxShadow: `0 0 50px ${cor}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 62,
      color: cor,
    }}
  >
    {icone}
    {texto}
  </div>
);
