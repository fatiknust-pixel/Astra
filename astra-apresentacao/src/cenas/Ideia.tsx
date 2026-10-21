import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COR, SANS, SOMBRA, entrada, useArea, useFormato } from "../tema";
import { Capitulo } from "../componentes/Cena";
import { Cantos } from "../componentes/Base";
import { Qr } from "../componentes/Qr";
import { quando } from "../dados";
import { Sfx } from "../componentes/Som";

export const Ideia = () => {
  const f = useCurrentFrame();
  const { v } = useFormato();
  const a = useArea();
  const q = v ? 420 : 380;
  const itens = [
    { texto: "TAB:posto-14", nome: "Posto 14", sub: "tabela de torque do posto", em: quando("ideia", "posto", 0, 50) },
    { texto: "MAQ:7", nome: "Máquina 7", sub: "ficha da máquina", em: quando("ideia", "máquina", 0, 100) },
  ];
  const tScan = quando("ideia", "escanear", 0, 170);
  const gap = v ? 60 : 70;
  const x0 = v ? a.x + (a.w - (2 * q + gap)) / 2 : a.x + (a.w - (2 * q + gap)) / 2;
  const y0 = v ? a.y + 80 : a.y + 70;
  return (
    <AbsoluteFill>
      <Capitulo n={3} rotulo="A ideia" titulo="Um QR Code em cada posto e máquina" />
      {itens.map((it, i) => {
        const p = entrada(f, it.em - 8, 20);
        return (
          <div key={it.nome} style={{ position: "absolute", left: x0 + i * (q + gap), top: y0, width: q, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
            <div style={{ background: COR.branco, padding: 30, borderRadius: 16, boxShadow: SOMBRA }}>
              <Qr texto={it.texto} tamanho={q - 60} revelar={entrada(f, it.em, 26)} />
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: COR.tinta, marginTop: 28 }}>{it.nome}</div>
            <div style={{ fontFamily: SANS, fontSize: 26, color: COR.suave, marginTop: 6 }}>{it.sub}</div>
          </div>
        );
      })}
      <Cantos x={x0 - 24} y={y0 - 24} w={q + 48} h={q + 48} em={tScan - 10} />
      <Sfx nome="tique" em={14} volume={0.2} />
    </AbsoluteFill>
  );
};
