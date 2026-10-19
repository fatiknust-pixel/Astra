import { AbsoluteFill, useCurrentFrame } from "remotion";
import { quando } from "../dados";
import { COR, MONO, SANS, useFormato } from "../tema";
import { Caixa, Conector, Defs, Titulo } from "../componentes/Base";
import { Sfx } from "../componentes/Som";

const ID = "estados";

export const Estados = () => {
  const f = useCurrentFrame();
  const { v, W, H } = useFormato();
  const e = {
    espera: quando(ID, "esperando", 0, 30) - 4,
    leitura: quando(ID, "lê", 0, 55) - 4,
    libera: quando(ID, "libera", 0, 80) - 4,
    bloqueia: quando(ID, "bloqueia", 0, 110) - 4,
  };
  const nos = [
    { id: "espera", t: "ESPERA", d: "aguardando o dedo", cor: COR.destaque, em: e.espera },
    { id: "leitura", t: "LEITURA", d: "captura e compara a digital", cor: COR.destaque, em: e.leitura },
    { id: "libera", t: "LIBERADO", d: "relé ligado · LED verde", cor: COR.verde, em: e.libera },
    { id: "bloqueia", t: "BLOQUEADO", d: "relé desligado · LED vermelho", cor: COR.vermelho, em: e.bloqueia },
  ];
  const ativo = f >= e.bloqueia ? "bloqueia" : f >= e.libera ? "libera" : f >= e.leitura ? "leitura" : "espera";
  const G: Record<string, { x: number; y: number; w: number; h: number }> = v
    ? { espera: { x: 270, y: 470, w: 540, h: 140 }, leitura: { x: 270, y: 720, w: 540, h: 140 }, libera: { x: 70, y: 1000, w: 450, h: 150 }, bloqueia: { x: 560, y: 1000, w: 450, h: 150 } }
    : { espera: { x: 110, y: 470, w: 400, h: 150 }, leitura: { x: 640, y: 470, w: 420, h: 150 }, libera: { x: 1210, y: 330, w: 600, h: 150 }, bloqueia: { x: 1210, y: 620, w: 600, h: 150 } };
  const c = (id: string, lado: "d" | "e" | "c" | "b") => {
    const g = G[id];
    return lado === "d" ? [g.x + g.w, g.y + g.h / 2] : lado === "e" ? [g.x, g.y + g.h / 2] : lado === "c" ? [g.x + g.w / 2, g.y] : [g.x + g.w / 2, g.y + g.h];
  };
  const L = (a: number[], b: number[], curva = 0, vertical = false) =>
    vertical ? `M ${a[0]} ${a[1]} C ${a[0]} ${a[1] + curva}, ${b[0]} ${b[1] - curva}, ${b[0]} ${b[1] - 4}` : `M ${a[0]} ${a[1]} C ${a[0] + curva} ${a[1]}, ${b[0] - curva} ${b[1]}, ${b[0] - 4} ${b[1]}`;
  return (
    <AbsoluteFill>
      <Titulo n={5} rotulo="Passo a passo" texto="Uma máquina de estados decide o que fazer." style={{ position: "absolute", left: v ? 70 : 110, top: v ? 210 : 170, width: 1400 }} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <Defs />
        {v ? (
          <>
            <Conector d={L(c("espera", "b"), c("leitura", "c"), 40, true)} em={e.leitura - 6} />
            <Conector d={L(c("leitura", "b"), c("libera", "c"), 70, true)} em={e.libera - 6} />
            <Conector d={L(c("leitura", "b"), c("bloqueia", "c"), 70, true)} em={e.bloqueia - 6} />
            <Conector d={`M 70 1075 C 20 1075, 20 540, 266 540`} em={e.bloqueia + 14} cor={COR.apagado} />
          </>
        ) : (
          <>
            <Conector d={L(c("espera", "d"), c("leitura", "e"), 40)} em={e.leitura - 6} />
            <Conector d={L(c("leitura", "d"), c("libera", "e"), 90)} em={e.libera - 6} />
            <Conector d={L(c("leitura", "d"), c("bloqueia", "e"), 90)} em={e.bloqueia - 6} />
            <Conector d={`M 1510 770 C 1510 900, 310 900, 310 624`} em={e.bloqueia + 14} cor={COR.apagado} />
          </>
        )}
      </svg>
      {nos.map((n) => {
        const g = G[n.id];
        const on = ativo === n.id;
        return (
          <Caixa key={n.id} em={n.em - 6} ativo={on} cor={n.cor} style={{ position: "absolute", left: g.x, top: g.y, width: g.w, height: g.h, padding: "24px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ width: 16, height: 16, borderRadius: 8, background: on ? n.cor : COR.apagado, boxShadow: on ? `0 0 16px ${n.cor}` : "none" }} />
              <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 30, letterSpacing: 3, color: on ? COR.texto : COR.suave }}>{n.t}</span>
            </div>
            <div style={{ fontFamily: SANS, fontSize: v ? 25 : 25, color: COR.suave, marginTop: 8 }}>{n.d}</div>
          </Caixa>
        );
      })}
      <div style={{ position: "absolute", left: v ? 70 : 640, top: v ? 1230 : 860, fontFamily: SANS, fontSize: 25, color: COR.apagado, opacity: f > e.bloqueia + 20 ? 1 : 0 }}>
        Depois de cada leitura, o sistema volta a esperar.
      </div>
      <Sfx nome="clique" em={e.libera + 4} volume={0.14} />
      <Sfx nome="clique" em={e.bloqueia + 4} volume={0.14} />
    </AbsoluteFill>
  );
};
