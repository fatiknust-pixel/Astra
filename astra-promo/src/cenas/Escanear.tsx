import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MARCAS, quando } from "../dados";
import { COR, MONO, SANS, useFormato } from "../tema";
import { Celular, Destaque, Tela, noCelular, posCelular } from "../componentes/Celular";
import { Camera } from "../componentes/Camera";
import { Ficha, Rotulo, Surge } from "../componentes/Texto";
import { Sfx } from "../componentes/Som";

const ID = "escanear";

// QR do posto -> tabela de torque aparecendo na hora, linha por linha
export const Escanear = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { v } = useFormato();
  const CEL = posCelular(v);
  const pronto = quando(ID, "tabela", 0, 60) - 4;
  const trava = quando(ID, "QR", 0, pronto - 20) + 4;
  const aperto = quando(ID, "hora", 0, pronto + 30);
  const entra = spring({ frame: f, fps, config: { damping: 16, stiffness: 80 } });
  const telaSobe = spring({ frame: f - pronto + 2, fps, config: { damping: 18, stiffness: 120 } });
  const linhas = MARCAS["tabela-posto-14"].el[".ptab tbody tr"];
  const passo = 3;
  const linhaAtual = Math.floor((f - aperto) / passo);
  const rot = v ? interpolate(f, [0, 180], [-8, 8]) : interpolate(f, [0, 180], [-14, -4]);
  // linha 6 (Air Bag) salta para fora do celular
  const l6 = linhas[5];
  const pulo = spring({ frame: f - aperto - 8 * passo - 2, fps, config: { damping: 14 } });
  const pt = noCelular(CEL.largura, l6[0], l6[1]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: CEL.x, top: CEL.y + (1 - entra) * 700 }}>
        <Celular largura={CEL.largura} rotY={rot} rotX={4}>
          {f < pronto + 20 && <Camera f={f} texto="TAB:posto-14" legenda="POSTO 14" trava={trava} />}
          <Tela nome="tabela-posto-14" style={{ transform: `translateY(${(1 - telaSobe) * 844}px)` }}>
            {linhas.map((r, i) => (
              <Destaque key={i} r={r} p={linhaAtual === i ? 1 : linhaAtual > i ? 0 : 0} cor={COR.azul} raio={6} folga={0} />
            ))}
          </Tela>
        </Celular>
      </div>
      {/* linha "Air Bag · 0,7" ampliada */}
      {pulo > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: interpolate(pulo, [0, 1], [CEL.x + pt.x, v ? 520 : 900]),
            top: interpolate(pulo, [0, 1], [CEL.y + pt.y - 10, v ? 1340 : 760]),
            width: 520,
            transform: `scale(${0.6 + 0.4 * pulo})`,
            transformOrigin: "0 50%",
            opacity: pulo,
            background: "#fff",
            borderRadius: 16,
            boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 0 3px ${COR.azul}`,
            display: "flex",
            alignItems: "center",
            padding: "18px 26px",
            gap: 20,
            fontFamily: SANS,
          }}
        >
          <span style={{ fontFamily: MONO, color: "#6B7686", fontSize: 26 }}>6</span>
          <span style={{ flex: 1, fontSize: 32, fontWeight: 600, color: "#0E1726" }}>Air Bag</span>
          <span style={{ fontFamily: MONO, fontSize: 40, fontWeight: 600, color: COR.marinho }}>0,7</span>
          <span style={{ fontFamily: MONO, fontSize: 20, color: "#6B7686" }}>N·m</span>
        </div>
      )}
      <div style={{ position: "absolute", left: v ? 70 : 900, top: v ? 200 : 190, width: v ? 960 : 1000 }}>
        <Rotulo texto="01 · Tabelas de torque" em={2} />
        <Surge texto="Escaneie o QR do posto." em={4} tamanho={v ? 62 : 74} intervalo={2} style={{ marginTop: 26 }} />
        <Surge texto="A tabela aparece na hora." em={pronto} tamanho={v ? 62 : 74} intervalo={2} cor={COR.ciano} style={{ marginTop: 10 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: v ? 30 : 50, maxWidth: v ? 960 : 820 }}>
          <Ficha texto="TAB:posto-14" em={trava + 2} mono cor={COR.verde} />
          <Ficha texto="8 apertos" em={pronto + 6} />
          <Ficha texto="Torque em N·m" em={pronto + 10} />
        </div>
      </div>
      <Sfx nome="whoosh" em={0} volume={0.3} />
      <Sfx nome="bipe" em={trava} volume={0.55} />
      <Sfx nome="whoosh" em={pronto - 2} volume={0.3} />
      {linhas.map((_, i) => (
        <Sfx key={i} nome="tique" em={aperto + i * passo} volume={0.3} />
      ))}
      <Sfx nome="pop" em={aperto + 8 * passo + 2} volume={0.5} />
    </AbsoluteFill>
  );
};
