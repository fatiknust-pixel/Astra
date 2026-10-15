// Vídeo do Projeto 5S (16:9). Roteiro em conteudo/5s/video.json, casos em conteudo/5s/casos.json,
// narração em src/gerado/5s/narracao.json (npm run audio:5s).
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, spring, useCurrentFrame } from "remotion";
import { FaArrowRight, FaBroom, FaCamera, FaCheck, FaClipboardCheck, FaFilter, FaPeopleGroup, FaTableCellsLarge } from "react-icons/fa6";
import { arquivo } from "../dados";
import "../tema"; // carrega as fontes do projeto
// Fonte própria deste vídeo (o FONTE do tema depende de --fonte, definido só nos vídeos 9:16)
const FONTE = "Montserrat, 'Arial Black', Arial, sans-serif";
import DADOS from "../../conteudo/5s/casos.json";
import ROTEIRO from "../../conteudo/5s/video.json";
import NARRACAO from "../gerado/5s/narracao.json";

export const FPS = 30;
export const LARG = 1920;
export const ALT = 1080;
const ATRASO = 8; // frames entre o começo da cena e a voz (tempo da transição)
const RESPIRO = 8; // frames depois da última frase

const COR = {
  tinta: "#141C25",
  tinta2: "#1E2935",
  amarelo: "#F5C400",
  antes: "#C2410C",
  depois: "#1F5FA8",
  cinza: "#9AA6B2",
  branco: "#FFFFFF",
};

type Frase = { texto: string; i: number; f: number };
type Narr = { duracao: number; frases: Frase[] };
type Caso = (typeof DADOS.casos)[number] & { durante?: string[]; acao?: string; sensos?: string[]; depois?: string[] };
type CenaR = (typeof ROTEIRO.cenas)[number] & { caso?: string; marcas?: Record<string, number> };

// A narração vem do scripts/gerar_audio.py (edge-tts): tempo de cada palavra por cena.
// Aqui as palavras são agrupadas de volta nas frases do roteiro, contando letras e números.
type Palavra = { p: string; i: number; f: number };
const letras = (s: string) => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "").length;
const montarNarracao = (): Record<string, Narr> => {
  const cenas = (NARRACAO as any).cenas as Record<string, { duracao: number; palavras: Palavra[] }>;
  const out: Record<string, Narr> = {};
  for (const c of ROTEIRO.cenas) {
    const n = cenas[c.id];
    const frases: Frase[] = [];
    let k = 0;
    for (const texto of c.frases) {
      const alvo = letras(texto);
      let soma = 0;
      const ini = k;
      while (k < n.palavras.length && (k === ini || (soma < alvo && soma + letras(n.palavras[k].p) <= alvo + 1))) soma += letras(n.palavras[k++].p);
      const ws = n.palavras.slice(ini, Math.max(ini + 1, k));
      frases.push({ texto, i: ws[0]?.i ?? 0, f: ws[ws.length - 1]?.f ?? 0 });
    }
    const fim = n.palavras[n.palavras.length - 1]?.f;
    out[c.id] = { duracao: fim ? Math.min(n.duracao, fim + 0.3) : n.duracao, frases };
  }
  return out;
};
const NARR = montarNarracao();
const foto = (id: string) => arquivo(`5s/fotos/${id}.jpg`);
const sfx = (n: string) => arquivo(`sfx/${n}.mp3`);
const quadros = (s: number) => Math.round(s * FPS);
const inicioFrase = (cena: string, n: number) => ATRASO + quadros(NARR[cena].frases[Math.min(n, NARR[cena].frases.length - 1)].i);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const CENAS = (ROTEIRO.cenas as CenaR[]).map((c) => ({ ...c, duracao: ATRASO + quadros(NARR[c.id].duracao) + RESPIRO }));
const INICIOS = CENAS.reduce<number[]>((acc, c, i) => [...acc, i === 0 ? 0 : acc[i - 1] + CENAS[i - 1].duracao], []);
export const DURACAO_TOTAL = INICIOS[INICIOS.length - 1] + CENAS[CENAS.length - 1].duracao;

// ---------- peças visuais ----------
const listras = (tam = 28) => `repeating-linear-gradient(-45deg, ${COR.amarelo} 0 ${tam}px, ${COR.tinta} ${tam}px ${tam * 2}px)`;

const FaixaZebrada: React.FC<{ topo?: number; baixo?: number; altura?: number; entra?: number }> = ({ topo, baixo, altura = 26, entra = 0 }) => {
  const f = useCurrentFrame();
  const larg = interpolate(f, [entra, entra + 18], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 0, top: topo, bottom: baixo, height: altura, width: `${larg}%`, backgroundImage: listras(), backgroundPosition: `${f * 2}px 0` }} />
  );
};

const Selo5S: React.FC<{ tam?: number; entra?: number }> = ({ tam = 150, entra = 0 }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - entra, fps: FPS, config: { damping: 20 } });
  return (
    <div style={{ width: tam * 1.45, height: tam, borderRadius: tam * 0.14, background: COR.amarelo, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FONTE, fontWeight: 900, fontSize: tam * 0.62, color: COR.tinta, transform: `scale(${0.85 + 0.15 * s})`, opacity: s, boxShadow: "0 18px 40px rgba(0,0,0,.35)" }}>
      5S
    </div>
  );
};

const Etiqueta: React.FC<{ texto: string; cor: string; s?: number; tam?: number }> = ({ texto, cor, s = 1, tam = 30 }) => (
  <div style={{ fontFamily: FONTE, fontWeight: 800, fontSize: tam, letterSpacing: 3, color: "#fff", background: cor, padding: `${tam * 0.25}px ${tam * 0.6}px`, borderRadius: 10,
    transform: `scale(${s})`, transformOrigin: "left center", opacity: s, boxShadow: "0 6px 18px rgba(0,0,0,.3)" }}>
    {texto}
  </div>
);

const Kicker: React.FC<{ texto: string; cor?: string }> = ({ texto, cor = COR.amarelo }) => (
  <div style={{ fontFamily: FONTE, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: cor }}>{texto}</div>
);

const surge = (f: number, em: number, dist = 40) => {
  const s = spring({ frame: f - em, fps: FPS, config: { damping: 15 } });
  return { opacity: s, transform: `translateY(${(1 - s) * dist}px)` };
};

// Legenda da frase falada no momento
const Legenda: React.FC<{ cena: string }> = ({ cena }) => {
  const f = useCurrentFrame();
  const fr = NARR[cena].frases;
  const t = (f - ATRASO) / FPS;
  const atual = fr.findIndex((x, i) => t >= x.i - 0.05 && t < (fr[i + 1]?.i ?? x.f + 0.5));
  if (atual < 0) return null;
  const local = f - inicioFrase(cena, atual);
  const s = interpolate(local, [0, 6], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ maxWidth: 1500, fontFamily: FONTE, fontWeight: 700, fontSize: 36, lineHeight: 1.3, color: "#fff", background: "rgba(10,14,20,.82)", padding: "12px 28px",
        borderRadius: 14, textAlign: "center", opacity: s, transform: `translateY(${(1 - s) * 12}px)` }}>
        {fr[atual].texto}
      </div>
    </div>
  );
};

const Fundo: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 75% 20%, ${COR.tinta2} 0%, ${COR.tinta} 60%)` }}>{children}</AbsoluteFill>
);

// ---------- cenas ----------
const Abertura: React.FC<{ cena: string }> = ({ cena }) => {
  const f = useCurrentFrame();
  const mosaico = ["f0048", "f0031", "f0036", "f0044", "f0056", "f0033"];
  const f2 = inicioFrase(cena, 1);
  return (
    <Fundo>
      <AbsoluteFill style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: 8, transform: `scale(${1.15 - f * 0.0006}) translateX(${-f * 0.5}px)`, opacity: 0.32 }}>
        {mosaico.map((m) => <Img key={m} src={foto(m)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />)}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(20,28,37,.97) 0%, rgba(20,28,37,.85) 55%, rgba(20,28,37,.4) 100%)" }} />
      <FaixaZebrada topo={0} entra={2} />
      <FaixaZebrada baixo={0} entra={6} />
      <div style={{ position: "absolute", left: 140, top: 210, display: "flex", flexDirection: "column", gap: 34 }}>
        <Selo5S entra={4} />
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontFamily: FONTE, fontWeight: 900, fontSize: 150, lineHeight: 1, color: "#fff", transform: `translateY(${interpolate(f, [12, 28], [160, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px)` }}>
            PROJETO 5S
          </div>
        </div>
        <div style={{ ...surge(f, 26), fontFamily: FONTE, fontWeight: 600, fontSize: 44, color: "#E3E8ED", maxWidth: 1100, lineHeight: 1.25 }}>
          Organização e padronização dos postos da linha de montagem
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
          {[`${DADOS.casos.length} áreas`, `${DADOS.casos.filter((c) => c.status === "concluido").length} melhorias concluídas`, "Antes e depois"].map((t, i) => (
            <div key={t} style={{ ...surge(f, f2 + i * 8, 30), fontFamily: FONTE, fontWeight: 800, fontSize: 30, color: COR.tinta, background: COR.amarelo, padding: "10px 24px", borderRadius: 40 }}>{t}</div>
          ))}
        </div>
      </div>
      <div style={{ ...surge(f, 40), position: "absolute", left: 140, bottom: 205, fontFamily: FONTE, fontWeight: 600, fontSize: 28, color: COR.cinza }}>
        {DADOS.projeto.equipe}  ·  {DADOS.projeto.data}
      </div>
    </Fundo>
  );
};

const ICONES = [FaFilter, FaTableCellsLarge, FaBroom, FaClipboardCheck, FaPeopleGroup];
const Sensos: React.FC<{ cena: string }> = ({ cena }) => {
  const f = useCurrentFrame();
  const fr = NARR[cena].frases[1];
  const passo = quadros((fr.f - fr.i) / 5);
  const ini = inicioFrase(cena, 1);
  return (
    <Fundo>
      <div style={{ position: "absolute", left: 120, top: 100, ...surge(f, 4) }}><Kicker texto="METODOLOGIA" /></div>
      <div style={{ position: "absolute", left: 120, top: 145, fontFamily: FONTE, fontWeight: 900, fontSize: 76, color: "#fff", ...surge(f, 8) }}>Os 5 sensos</div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 330, display: "flex", gap: 28 }}>
        {DADOS.sensos.map((s, i) => {
          const em = ini + i * passo - 4;
          const sp = spring({ frame: f - em, fps: FPS, config: { damping: 20 } });
          const Ic = ICONES[i];
          return (
            <div key={s.jp} style={{ flex: 1, height: 480, borderRadius: 24, background: "#fff", padding: 34, display: "flex", flexDirection: "column", gap: 18,
              opacity: sp, transform: `translateY(${(1 - sp) * 120}px)`, boxShadow: "0 24px 50px rgba(0,0,0,.35)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: FONTE, fontWeight: 900, fontSize: 90, color: COR.tinta, lineHeight: 1 }}>{i + 1}</div>
                <div style={{ width: 84, height: 84, borderRadius: 42, background: COR.amarelo, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic size={42} color={COR.tinta} />
                </div>
              </div>
              <div style={{ fontFamily: FONTE, fontWeight: 800, fontSize: 22, letterSpacing: 3, color: "#5A6876" }}>{s.jp.toUpperCase()}</div>
              <div style={{ fontFamily: FONTE, fontWeight: 900, fontSize: 36, color: COR.tinta, lineHeight: 1.1 }}>{s.pt}</div>
              <div style={{ fontFamily: FONTE, fontWeight: 600, fontSize: 25, color: "#3B4754", lineHeight: 1.35 }}>{s.frase}</div>
            </div>
          );
        })}
      </div>
    </Fundo>
  );
};

const Painel: React.FC<{ src: string; style: React.CSSProperties; zoom?: number }> = ({ src, style, zoom = 1 }) => (
  <div style={{ position: "absolute", overflow: "hidden", borderRadius: 22, ...style }}>
    <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
  </div>
);

const CasoCena: React.FC<{ cena: CenaR; numero: number }> = ({ cena, numero }) => {
  const f = useCurrentFrame();
  const c = DADOS.casos.find((x) => x.id === cena.caso) as Caso;
  const m: Record<string, number> = cena.marcas ?? {};
  const tDep = inicioFrase(cena.id, m.depois ?? 2) - 4;
  const tDur = m.durante !== undefined ? inicioFrase(cena.id, m.durante) - 4 : null;
  const tFim = m.final !== undefined && m.final !== m.depois ? inicioFrase(cena.id, m.final) - 4 : tDep + 50;
  const SW = 1160, SH = 760, SX = 80, SY = 110;
  const antes = c.id === "ferramentas" ? "f0047" : c.antes[0];
  const depois = c.depois![0];
  const wipe = (t: number) => interpolate(f, [t, t + 16], [100, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const wDur = tDur !== null ? wipe(tDur) : 100;
  const wDep = wipe(tDep);
  const split = interpolate(f, [tFim, tFim + 20], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const esq = split * (SW / 2 - 10);
  const tagAntes = spring({ frame: f - 10, fps: FPS, config: { damping: 20 } });
  const tagDep = spring({ frame: f - tDep - 10, fps: FPS, config: { damping: 20 } });
  const check = spring({ frame: f - tFim - 16, fps: FPS, config: { damping: 20 } });
  const zoomA = 1.02 + f * 0.0007;
  const zoomD = 1.02 + Math.max(0, f - tDep) * 0.0007;
  return (
    <Fundo>
      {/* palco de fotos */}
      <div style={{ position: "absolute", left: SX, top: SY, width: SW, height: SH, ...surge(f, 0, 60) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 22, boxShadow: "0 30px 60px rgba(0,0,0,.45)" }} />
        {/* lado direito: antes -> durante -> depois (cortinas) */}
        <Painel src={foto(antes)} zoom={zoomA} style={{ left: esq + (split > 0 ? 20 : 0), top: 0, width: SW - esq - (split > 0 ? 20 : 0), height: SH }} />
        {tDur !== null && <Painel src={foto(c.durante![0])} zoom={zoomA} style={{ left: esq + (split > 0 ? 20 : 0), top: 0, width: SW - esq - (split > 0 ? 20 : 0), height: SH, clipPath: `inset(0 0 0 ${wDur}%)` }} />}
        <Painel src={foto(depois)} zoom={zoomD} style={{ left: esq + (split > 0 ? 20 : 0), top: 0, width: SW - esq - (split > 0 ? 20 : 0), height: SH, clipPath: `inset(0 0 0 ${wDep}%)` }} />
        {[tDur, tDep].map((t, i) => t !== null && f > t && f < t + 17 && (
          <div key={i} style={{ position: "absolute", top: 0, height: SH, width: 12, background: COR.amarelo, left: `${(i === 0 ? wDur : wDep) / 100 * SW - 6}px`, boxShadow: "0 0 30px rgba(245,196,0,.8)" }} />
        ))}
        {/* lado esquerdo (aparece no final): antes */}
        {split > 0 && <Painel src={foto(antes)} style={{ left: 0, top: 0, width: esq, height: SH }} />}
        {/* etiquetas */}
        <div style={{ position: "absolute", left: 24, top: 24 }}>
          {f < tDep + 8 ? (
            <Etiqueta texto={tDur !== null && f >= tDur + 8 ? "LIMPEZA" : "ANTES"} cor={tDur !== null && f >= tDur + 8 ? "#4A5866" : COR.antes} s={tagAntes} />
          ) : split > 0.5 ? <Etiqueta texto="ANTES" cor={COR.antes} s={split} /> : null}
        </div>
        {f >= tDep + 8 && (
          <div style={{ position: "absolute", left: esq + (split > 0 ? 20 : 0) + 24, top: 24 }}><Etiqueta texto="DEPOIS" cor={COR.depois} s={tagDep} /></div>
        )}
        {split > 0.6 && (
          <div style={{ position: "absolute", left: SW / 2 - 52, top: SH / 2 - 52, width: 104, height: 104, borderRadius: 52, background: COR.amarelo, display: "flex", alignItems: "center", justifyContent: "center",
            border: `6px solid ${COR.tinta}`, transform: `scale(${check})` }}>
            <FaArrowRight size={50} color={COR.tinta} />
          </div>
        )}
      </div>

      {/* painel de texto */}
      <div style={{ position: "absolute", left: 1310, top: SY, width: 530, display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={surge(f, 4)}><Kicker texto={`CASO ${String(numero).padStart(2, "0")}`} /></div>
        <div style={{ ...surge(f, 8), fontFamily: FONTE, fontWeight: 900, fontSize: 52, lineHeight: 1.08, color: "#fff", whiteSpace: "pre-line" }}>{c.titulo.replace(" · ", "\n")}</div>
        <div style={{ ...surge(f, inicioFrase(cena.id, 1)), background: "rgba(255,255,255,.06)", borderRadius: 18, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontFamily: FONTE, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: "#F07A45" }}>PROBLEMA</div>
          <div style={{ fontFamily: FONTE, fontWeight: 600, fontSize: 28, lineHeight: 1.3, color: "#E9EDF1" }}>{c.problema}</div>
        </div>
        <div style={{ ...surge(f, tDep + 6), background: "rgba(255,255,255,.06)", borderRadius: 18, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontFamily: FONTE, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: "#6FA8E8" }}>AÇÃO 5S</div>
          <div style={{ fontFamily: FONTE, fontWeight: 600, fontSize: 28, lineHeight: 1.3, color: "#E9EDF1" }}>{c.acao}</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {(c.sensos ?? []).map((s, i) => {
            const sp = spring({ frame: f - tFim - 20 - i * 6, fps: FPS, config: { damping: 20 } });
            return <div key={s} style={{ fontFamily: FONTE, fontWeight: 800, fontSize: 26, color: COR.tinta, background: COR.amarelo, padding: "8px 22px", borderRadius: 30, transform: `scale(${sp})` }}>{s}</div>;
          })}
        </div>
      </div>
      <Sequence from={tDep} durationInFrames={30}><Audio src={sfx("whoosh")} volume={0.35} /></Sequence>
      {tDur !== null && <Sequence from={tDur} durationInFrames={30}><Audio src={sfx("whoosh")} volume={0.35} /></Sequence>}
      <Sequence from={tFim + 16} durationInFrames={40}><Audio src={sfx("ding")} volume={0.4} /></Sequence>
    </Fundo>
  );
};

const Pendentes: React.FC<{ cena: string }> = ({ cena }) => {
  const f = useCurrentFrame();
  const lista = DADOS.casos.filter((c) => c.status === "pendente");
  // Uma área só: mostra as fotos dela; várias: uma foto por área
  const uma = lista.length === 1;
  const itens = uma
    ? lista[0].antes.map((a) => ({ id: a, foto: a, titulo: null as string | null }))
    : lista.map((c) => ({ id: c.id, foto: c.antes[0], titulo: c.titulo as string | null }));
  const tCarimbo = inicioFrase(cena, 1) + 10;
  const t2 = inicioFrase(cena, 2);
  const passo = quadros((NARR[cena].frases[2].f - NARR[cena].frases[2].i) / itens.length);
  return (
    <Fundo>
      <div style={{ position: "absolute", left: 120, top: 90, ...surge(f, 2) }}><Kicker texto="AGUARDANDO O REGISTRO DO DEPOIS" /></div>
      <div style={{ position: "absolute", left: 120, top: 135, fontFamily: FONTE, fontWeight: 900, fontSize: 70, color: "#fff", ...surge(f, 6) }}>{uma ? lista[0].titulo : "Áreas em andamento"}</div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 290, display: "flex", gap: 40 }}>
        {itens.map((c, i) => {
          const em = 8 + i * 7;
          const sp = spring({ frame: f - em, fps: FPS, config: { damping: 20 } });
          const rot = [-1.5, 1, -1, 1.5][i];
          const realce = f >= t2 + i * passo - 4 && f < t2 + (i + 1) * passo;
          const st = spring({ frame: f - tCarimbo - i * 5, fps: FPS, config: { damping: 20 } });
          return (
            <div key={c.id} style={{ flex: 1, background: "#fff", padding: 16, paddingBottom: 22, borderRadius: 10, transform: `translateY(${(1 - sp) * -700}px) rotate(${rot}deg) scale(${realce ? 1.06 : 1})`,
              boxShadow: realce ? `0 0 0 6px ${COR.amarelo}, 0 30px 50px rgba(0,0,0,.5)` : "0 24px 40px rgba(0,0,0,.45)", position: "relative" }}>
              <Img src={foto(c.foto)} style={{ width: "100%", height: uma ? 440 : 400, objectFit: "cover", borderRadius: 4 }} />
              {c.titulo && <div style={{ fontFamily: FONTE, fontWeight: 800, fontSize: 28, color: COR.tinta, marginTop: 16, lineHeight: 1.15, minHeight: 66 }}>{c.titulo}</div>}
              <div style={{ position: "absolute", left: "50%", top: 170, transform: `translate(-50%, 0) rotate(-12deg) scale(${2.2 - st * 1.2})`, opacity: st,
                fontFamily: FONTE, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: COR.antes, border: `5px solid ${COR.antes}`, borderRadius: 10, padding: "8px 16px",
                background: "rgba(255,255,255,.9)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 10 }}>
                <FaCamera size={28} /> REGISTRO PENDENTE
              </div>
            </div>
          );
        })}
      </div>
      {uma && (
        <div style={{ position: "absolute", left: 120, right: 120, top: 830, ...surge(f, inicioFrase(cena, 2)), fontFamily: FONTE, fontWeight: 600, fontSize: 34, color: "#E3E8ED" }}>{lista[0].problema}</div>
      )}
      {itens.map((_, i) => (
        <Sequence key={i} from={tCarimbo + i * 5} durationInFrames={30}><Audio src={sfx("carimbo")} volume={0.3} /></Sequence>
      ))}
    </Fundo>
  );
};

const Numeros: React.FC<{ cena: string }> = ({ cena }) => {
  const f = useCurrentFrame();
  const fr = NARR[cena].frases[1];
  const ini = inicioFrase(cena, 1);
  const terco = quadros((fr.f - fr.i) / 3);
  const feitos = DADOS.casos.filter((c) => c.status === "concluido").length;
  const itens = [
    { n: DADOS.casos.length, t: "áreas trabalhadas", cor: "#fff" },
    { n: feitos, t: "melhorias concluídas", cor: COR.amarelo },
    { n: DADOS.projeto.fotos, t: "fotos registradas", cor: "#fff" },
  ];
  const barra = interpolate(f, [ini + terco, ini + terco + 30], [0, feitos / DADOS.casos.length], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <Fundo>
      <FaixaZebrada topo={0} entra={0} />
      <div style={{ position: "absolute", left: 120, top: 120, ...surge(f, 2) }}><Kicker texto="RESULTADO" /></div>
      <div style={{ position: "absolute", left: 120, top: 165, fontFamily: FONTE, fontWeight: 900, fontSize: 70, color: "#fff", ...surge(f, 6) }}>Em resumo</div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 330, display: "flex", gap: 40 }}>
        {itens.map((it, i) => {
          const em = ini + i * terco - 6;
          const v = Math.round(interpolate(f, [em, em + 24], [0, it.n], { ...clamp, easing: Easing.out(Easing.cubic) }));
          return (
            <div key={it.t} style={{ flex: 1, ...surge(f, em, 60), background: "rgba(255,255,255,.06)", borderRadius: 28, padding: "36px 44px" }}>
              <div style={{ fontFamily: FONTE, fontWeight: 900, fontSize: 200, lineHeight: 1, color: it.cor }}>{v}</div>
              <div style={{ fontFamily: FONTE, fontWeight: 700, fontSize: 40, color: "#DDE3E9", marginTop: 10 }}>{it.t}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 790, ...surge(f, ini + terco) }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONTE, fontWeight: 700, fontSize: 28, color: COR.cinza, marginBottom: 14 }}>
          <span>Áreas com antes e depois</span><span>{feitos} de {DADOS.casos.length}</span>
        </div>
        <div style={{ height: 30, borderRadius: 15, background: "rgba(255,255,255,.12)", overflow: "hidden" }}>
          <div style={{ width: `${barra * 100}%`, height: "100%", background: COR.amarelo, borderRadius: 15 }} />
        </div>
      </div>
      {itens.map((_, i) => (
        <Sequence key={i} from={ini + i * terco - 6} durationInFrames={20}><Audio src={sfx("pop")} volume={0.4} /></Sequence>
      ))}
    </Fundo>
  );
};

const Encerramento: React.FC<{ cena: string }> = ({ cena }) => {
  const f = useCurrentFrame();
  const t2 = inicioFrase(cena, 1);
  return (
    <AbsoluteFill style={{ background: COR.tinta }}>
      <Img src={foto("f0036")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + f * 0.0012})`, opacity: 0.35 }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle, rgba(20,28,37,.55) 0%, rgba(20,28,37,.95) 75%)" }} />
      <FaixaZebrada topo={0} entra={0} />
      <FaixaZebrada baixo={0} entra={4} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40, paddingBottom: 60 }}>
        <Selo5S tam={120} entra={2} />
        <div style={{ ...surge(f, 10), fontFamily: FONTE, fontWeight: 900, fontSize: 84, color: "#fff", textAlign: "center", lineHeight: 1.1, maxWidth: 1500 }}>
          Posto organizado é posto <span style={{ color: COR.amarelo }}>seguro</span> e <span style={{ color: COR.amarelo }}>produtivo</span>
        </div>
        <div style={{ ...surge(f, t2), display: "flex", alignItems: "center", gap: 18, fontFamily: FONTE, fontWeight: 800, fontSize: 48, color: COR.tinta, background: COR.amarelo, padding: "14px 36px", borderRadius: 50 }}>
          <FaCheck size={40} /> Obrigado
        </div>
        <div style={{ ...surge(f, t2 + 10), fontFamily: FONTE, fontWeight: 600, fontSize: 30, color: COR.cinza }}>{DADOS.projeto.equipe}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};


// Emblema (canto inferior direito, com brilho que passa de tempos em tempos) e texto (canto superior
// esquerdo). PNGs sem fundo em public/5s/marca/; os caminhos ficam em casos.json -> projeto.marca.
const MARCA = (DADOS.projeto as { marca?: { logo?: string; texto?: string } }).marca ?? {};
const Marca: React.FC = () => {
  const f = useCurrentFrame();
  const entra = interpolate(f, [10, 40], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ciclo = f % 210; // brilho a cada 7 s
  const brilho = interpolate(ciclo, [0, 40], [-60, 160], clamp);
  const respira = 1 + 0.015 * Math.sin(f / 30);
  const tam = 116;
  return (
    <>
      {MARCA.logo && (
        <div style={{ position: "absolute", right: 46, bottom: 40, width: tam, height: tam, opacity: entra * 0.95, transform: `scale(${respira})`,
          filter: "drop-shadow(0 4px 14px rgba(0,0,0,.45))" }}>
          <Img src={arquivo(MARCA.logo)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `url(${arquivo(MARCA.logo)})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center",
            background: `linear-gradient(115deg, transparent ${brilho - 30}%, rgba(255,255,255,.85) ${brilho}%, transparent ${brilho + 30}%)` }} />
        </div>
      )}
      {MARCA.texto && (
        <div style={{ position: "absolute", left: 46, top: 34, height: 52, opacity: entra, transform: `translateX(${(1 - entra) * -30}px)`,
          filter: `drop-shadow(0 0 ${6 + 6 * Math.max(0, Math.sin(f / 45))}px rgba(255,255,255,.25)) drop-shadow(0 3px 10px rgba(0,0,0,.5))` }}>
          <Img src={arquivo(MARCA.texto)} style={{ height: "100%", width: "auto", objectFit: "contain" }} />
        </div>
      )}
    </>
  );
};

// Faixa zebrada que varre a tela na troca de cena
const Transicao: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 18], [-2400, 2400], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: -200, left: x, width: 2200, height: 1480, transform: "skewX(-18deg)", display: "flex" }}>
        <div style={{ width: 140, height: "100%", backgroundImage: listras(36) }} />
        <div style={{ flex: 1, height: "100%", background: COR.amarelo }} />
        <div style={{ width: 140, height: "100%", backgroundImage: listras(36) }} />
      </div>
    </AbsoluteFill>
  );
};

export const Projeto5S: React.FC = () => {
  let numCaso = 0;
  return (
    <AbsoluteFill style={{ background: COR.tinta }}>
      <Audio src={sfx("trilha")} loop volume={(f) => (f < 60 || f > DURACAO_TOTAL - 120 ? 0.22 : 0.09)} />
      {CENAS.map((c, i) => {
        const n = c.tipo === "caso" ? ++numCaso : 0;
        return (
          <Sequence key={c.id} from={INICIOS[i]} durationInFrames={c.duracao} name={c.id}>
            {c.tipo === "abertura" && <Abertura cena={c.id} />}
            {c.tipo === "sensos" && <Sensos cena={c.id} />}
            {c.tipo === "caso" && <CasoCena cena={c} numero={n} />}
            {c.tipo === "pendentes" && <Pendentes cena={c.id} />}
            {c.tipo === "numeros" && <Numeros cena={c.id} />}
            {c.tipo === "encerramento" && <Encerramento cena={c.id} />}
            <Legenda cena={c.id} />
            <Sequence from={ATRASO}><Audio src={arquivo(`5s/audio/${c.id}.mp3`)} /></Sequence>
          </Sequence>
        );
      })}
      <Marca />
      {INICIOS.slice(1).map((ini, i) => (
        <Sequence key={"t" + i} from={ini - 9} durationInFrames={19} name="transição">
          <Transicao />
          <Audio src={sfx("whoosh")} volume={0.3} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
