import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { quando } from "../dados";
import { COR, MONO, SANS, entrada, useFormato } from "../tema";
import { Aparece, Caixa, Glossario, Titulo } from "../componentes/Base";
import { Icone } from "../componentes/Icones";

const ID = "seguranca";

/** Esquema simplificado: bateria → contato do relé (aberto) → linha +15. */
const Esquema: React.FC<{ f: number; semEnergia: boolean; em: number }> = ({ f, semEnergia, em }) => {
  const p = (a: number) => Math.max(0.0001, interpolate(f, [em + a, em + a + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const linha = (d: string, a: number, cor: string = COR.suave, w = 3) => {
    const ev = evolvePath(p(a), d);
    return <path d={d} stroke={cor} strokeWidth={w} fill="none" strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />;
  };
  return (
    <svg width={800} height={380} viewBox="0 0 800 380">
      {linha("M 60 150 H 330", 0)}
      {linha("M 470 150 H 740", 6)}
      <circle cx={330} cy={150} r={7} fill={COR.texto} opacity={p(8)} />
      <circle cx={470} cy={150} r={7} fill={COR.texto} opacity={p(8)} />
      {linha("M 330 150 L 450 92", 10, COR.texto, 4)}
      {linha("M 340 230 H 460 V 300 H 340 Z", 16)}
      {linha("M 400 230 V 128", 20, COR.apagado, 2)}
      <text x={60} y={128} fill={COR.suave} fontFamily={MONO} fontSize={20} opacity={p(4)}>+12 V · bateria</text>
      <text x={740} y={128} fill={COR.suave} fontFamily={MONO} fontSize={20} textAnchor="end" opacity={p(10)}>linha +15 → ignição</text>
      <text x={400} y={272} fill={COR.suave} fontFamily={MONO} fontSize={18} textAnchor="middle" opacity={p(20)}>bobina</text>
      <text x={400} y={340} fill={COR.apagado} fontFamily={SANS} fontSize={20} textAnchor="middle" opacity={p(22)}>comandada pelo Pico</text>
      <text x={470} y={70} fill={COR.destaque} fontFamily={MONO} fontSize={20} opacity={p(14)}>contato NA (aberto)</text>
      <g opacity={p(24)}>
        <rect x={40} y={200} width={190} height={56} rx={8} fill="none" stroke={semEnergia ? COR.vermelho : COR.linha} strokeWidth={2} />
        <text x={135} y={235} fill={semEnergia ? COR.vermelho : COR.suave} fontFamily={MONO} fontSize={18} textAnchor="middle">
          {semEnergia ? "SEM ENERGIA" : "SISTEMA LIGADO"}
        </text>
      </g>
    </svg>
  );
};

export const Seguranca = () => {
  const f = useCurrentFrame();
  const { v } = useFormato();
  const falta = quando(ID, "faltar", 0, 40) - 2;
  const nunca = quando(ID, "nunca", 0, 80) - 6;
  const semEnergia = f >= falta;
  const cadeia = ["Falta energia", "Relé desligado", "Contato aberto", "Carro bloqueado"];
  return (
    <AbsoluteFill>
      <Titulo n={6} rotulo="Segurança" texto="Se algo falhar, o carro fica travado." style={{ position: "absolute", left: v ? 70 : 110, top: v ? 210 : 170, width: 1400 }} />
      <div style={{ position: "absolute", left: v ? 140 : 90, top: v ? 430 : 360, transform: v ? "scale(1)" : "scale(1.05)", transformOrigin: "0 0" }}>
        <Esquema f={f} semEnergia={semEnergia} em={6} />
      </div>
      <div style={{ position: "absolute", left: v ? 70 : 1030, top: v ? 860 : 380, width: v ? 940 : 780, display: "flex", flexDirection: "column", gap: 12 }}>
        {cadeia.map((t, k) => {
          const em = falta + k * 8;
          const p = entrada(f, em, 12);
          const ultimo = k === cadeia.length - 1;
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, opacity: p, transform: `translateX(${(1 - p) * 20}px)` }}>
              <span style={{ fontFamily: MONO, fontSize: 20, color: COR.apagado, width: 40 }}>{k + 1}</span>
              <span style={{ fontFamily: SANS, fontWeight: ultimo ? 600 : 500, fontSize: 32, color: ultimo ? COR.vermelho : COR.texto }}>{t}</span>
              {ultimo && <Icone nome="bloqueio" tamanho={44} cor={COR.vermelho} />}
            </div>
          );
        })}
        <Caixa em={nunca} style={{ marginTop: 22, padding: "20px 26px" }}>
          <div style={{ fontFamily: SANS, fontSize: 27, color: COR.texto, lineHeight: 1.35 }}>
            Isso se chama <b style={{ color: COR.destaque, fontWeight: 600 }}>fail-safe</b>: em caso de falha, o sistema vai para o estado seguro.
          </div>
        </Caixa>
      </div>
      <div style={{ position: "absolute", left: v ? 70 : 110, top: v ? 1400 : 840, width: v ? 940 : 1700 }}>
        <Glossario em={nunca + 16} termo="NA" explica="normalmente aberto: sem comando, o contato fica desligado." />
        <Aparece em={nunca + 26} style={{ marginTop: 10 }}>
          <span style={{ fontFamily: SANS, fontSize: 23, color: COR.apagado }}>Um diodo 1N4007 protege o circuito contra picos de tensão da bobina do relé.</span>
        </Aparece>
      </div>
    </AbsoluteFill>
  );
};
