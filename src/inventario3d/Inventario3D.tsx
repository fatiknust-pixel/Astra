// Vídeo de portfólio do Inventário 3D (9:16). Roteiro em conteudo/inventario3d/roteiro.json,
// narração em src/gerado/inventario3d/narracao.json (gerada pelo GitHub Actions),
// telas capturadas do app em public/inventario3d/cap/ (sequências = 1 quadro do app por quadro do vídeo).
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, spring, useCurrentFrame } from "remotion";
import { FaBoxOpen, FaClock, FaComputer, FaMagnifyingGlass, FaMobileScreen, FaTableList } from "react-icons/fa6";
import { arquivo } from "../dados";
import "../tema";
import ROTEIRO from "../../conteudo/inventario3d/roteiro.json";
import NARRACAO from "../gerado/inventario3d/narracao.json";

const FONTE = "Montserrat, 'Arial Black', Arial, sans-serif";
export const FPS = 30;
export const LARG = 1080;
export const ALT = 1920;
const ATRASO = 8;
const RESPIRO = 10;

const COR = {
  fundo: "#0B1016",
  fundo2: "#16202C",
  ambar: "#F59E0B",
  azul: "#60A5FA",
  texto: "#E6EDF5",
  cinza: "#8B98A8",
  ok: "#22A447",
  duvida: "#E3B21C",
  erro: "#D93A3A",
  normal: "#C29A6B",
};

// ---------- narração: palavras agrupadas de volta nas frases do roteiro ----------
type Palavra = { p: string; i: number; f: number };
type Frase = { texto: string; i: number; f: number; palavras: Palavra[] };
const letras = (s: string) => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "").length;
const NARR: Record<string, { duracao: number; frases: Frase[]; palavras: Palavra[] }> = {};
for (const c of ROTEIRO.cenas) {
  const n = (NARRACAO as any).cenas[c.id] as { duracao: number; palavras: Palavra[] };
  const frases: Frase[] = [];
  let k = 0;
  for (const texto of c.frases) {
    const alvo = letras(texto);
    let soma = 0;
    const ini = k;
    while (k < n.palavras.length && (k === ini || (soma < alvo && soma + letras(n.palavras[k].p) <= alvo + 1))) soma += letras(n.palavras[k++].p);
    const ws = n.palavras.slice(ini, Math.max(ini + 1, k));
    frases.push({ texto, i: ws[0]?.i ?? 0, f: ws[ws.length - 1]?.f ?? 0, palavras: ws });
  }
  const fim = n.palavras[n.palavras.length - 1]?.f;
  NARR[c.id] = { duracao: fim ? Math.min(n.duracao, fim + 0.3) : n.duracao, frases, palavras: n.palavras };
}

const quadros = (s: number) => Math.round(s * FPS);
const inicioFrase = (cena: string, n: number) => ATRASO + quadros(NARR[cena].frases[Math.min(n, NARR[cena].frases.length - 1)].i);
// quadro em que a narração diz uma palavra (a primeira que começa com o texto dado)
const quandoDiz = (cena: string, inicio: string, depois = 0) => {
  const ps = NARR[cena].palavras;
  const w = ps.find((p) => p.i >= depois && p.p.toLowerCase().startsWith(inicio));
  return ATRASO + quadros(w?.i ?? 0);
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cap = (p: string) => arquivo(`inventario3d/cap/${p}`);
const sfx = (n: string) => arquivo(`sfx/${n}.mp3`);

// Capturas da versão de computador (px CSS da tela 1280×800): quadros de cada sequência e pontos usados pela câmera
const N = { voo: 100, zoom: 85, caixa: 50 };
const ANDARES = { cx: 620, cy: 450, w: 700, x: 368, y: [["D", 280], ["C", 412], ["B", 528], ["A", 644]] as const };
const LISTA = { x: 250, y: 85 };
const PAINEL = {
  cx: 1110, cy: 380, w: 560, link: [1015, 330] as const,
  foto: { x: 958, y: 104, w: 312, h: 214 }, endereco: { x: 958, y: 340, w: 300, h: 40 },
  nome: { x: 958, y: 386, w: 312, h: 52 }, codigo: { x: 958, y: 440, w: 200, h: 24 },
};

export const CENAS = ROTEIRO.cenas.map((c) => ({ id: c.id, duracao: ATRASO + quadros(NARR[c.id].duracao) + RESPIRO }));
const INICIOS = CENAS.reduce<number[]>((acc, c, i) => [...acc, i === 0 ? 0 : acc[i - 1] + CENAS[i - 1].duracao], []);
export const DURACAO_TOTAL = INICIOS[INICIOS.length - 1] + CENAS[CENAS.length - 1].duracao;

const surge = (f: number, em: number, dist = 40) => {
  const s = spring({ frame: f - em, fps: FPS, config: { damping: 16 } });
  return { opacity: s, transform: `translateY(${(1 - s) * dist}px)` };
};

// ---------- peças visuais ----------
const Fundo: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, ${COR.fundo2} 0%, ${COR.fundo} 65%)` }}>
      <AbsoluteFill style={{ opacity: 0.07, backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "60px 60px", backgroundPosition: `0 ${f * 0.6}px` }} />
      {children}
    </AbsoluteFill>
  );
};

// Título da cena: número + tema em âmbar, frase curta em branco
const Titulo: React.FC<{ n: number; kicker: string; titulo: string }> = ({ n, kicker, titulo }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 120 }}>
      <div style={{ ...surge(f, 4), fontFamily: FONTE, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: COR.ambar }}>
        {String(n).padStart(2, "0")} · {kicker.toUpperCase()}
      </div>
      <div style={{ ...surge(f, 8), fontFamily: FONTE, fontWeight: 900, fontSize: 66, lineHeight: 1.1, color: "#fff", marginTop: 14 }}>{titulo}</div>
    </div>
  );
};

// Celular com a tela do app. zoom/origem aproximam uma parte da tela.
const TELA_L = 560;
const TELA_A = Math.round((TELA_L * 844) / 390);
const Celular: React.FC<{ children: React.ReactNode; zoom?: number; origem?: string; topo?: number; entra?: number; x?: number; escala?: number }> = ({ children, zoom = 1, origem = "50% 50%", topo = 370, entra = 0, x = 0, escala = 1 }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - entra, fps: FPS, config: { damping: 18 } });
  return (
    <div style={{ position: "absolute", left: (LARG - TELA_L) / 2 - 16 + x, top: topo, padding: 16, borderRadius: 70, background: "#05080C",
      boxShadow: "0 0 0 3px #2A3644, 0 40px 90px rgba(0,0,0,.6)", opacity: s, transform: `translateY(${(1 - s) * 80}px) scale(${escala})`, transformOrigin: "50% 0%" }}>
      <div style={{ width: TELA_L, height: TELA_A, borderRadius: 54, overflow: "hidden", position: "relative", background: "#10151c" }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: origem }}>{children}</div>
      </div>
    </div>
  );
};

const Tela: React.FC<{ src: string; opacity?: number }> = ({ src, opacity = 1 }) => (
  <Img src={cap(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity }} />
);

// Aviso fixo: só o corredor 1 é real
const Aviso: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 52, display: "flex", justifyContent: "center", opacity: interpolate(f, [10, 25], [0, 1], clamp) }}>
      <div style={{ fontFamily: FONTE, fontWeight: 600, fontSize: 24, color: COR.cinza, background: "rgba(10,14,20,.75)", border: "1px solid #263241", borderRadius: 30, padding: "8px 22px" }}>
        Corredor 1 com dados reais · demais corredores simulados, só para demonstração
      </div>
    </div>
  );
};

// Legenda: frase falada, com a palavra atual destacada
const Legenda: React.FC<{ cena: string }> = ({ cena }) => {
  const f = useCurrentFrame();
  const fr = NARR[cena].frases;
  const t = (f - ATRASO) / FPS;
  const atual = fr.findIndex((x, i) => t >= x.i - 0.05 && t < (fr[i + 1]?.i ?? x.f + 0.6));
  if (atual < 0) return null;
  const s = interpolate(f - inicioFrase(cena, atual), [0, 6], [0, 1], clamp);
  const ws = fr[atual].palavras;
  const pal = fr[atual].texto.split(" ");
  // a fala tem palavras na mesma ordem do texto; o destaque usa o índice da palavra falada
  const falada = ws.filter((w) => w.i <= t).length - 1;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1650, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ fontFamily: FONTE, fontWeight: 800, fontSize: 36, lineHeight: 1.26, color: "#fff", background: "rgba(10,14,20,.86)", padding: "14px 28px",
        borderRadius: 18, textAlign: "center", opacity: s, transform: `translateY(${(1 - s) * 12}px)` }}>
        {pal.map((p, i) => (
          <span key={i} style={{ color: pal.length === ws.length && i === falada ? COR.ambar : "#fff" }}>{p}{i < pal.length - 1 ? " " : ""}</span>
        ))}
      </div>
    </div>
  );
};

// ---------- cenas ----------
const Problema: React.FC = () => {
  const f = useCurrentFrame();
  const t2 = inicioFrase("problema", 1);
  const linhas = ["A9606603541", "A9586660135", "N910105008013", "A0029943545", "A9616664015", "A9606604141", "A9678201221", "A9606600935", "A2019900292", "A9626660301"];
  const busca = Math.floor(f / 5) % linhas.length; // o "cursor" pulando de linha em linha
  const relogio = spring({ frame: f - t2, fps: FPS, config: { damping: 12 } });
  return (
    <Fundo>
      <div style={{ position: "absolute", left: 80, right: 80, top: 150 }}>
        <div style={{ ...surge(f, 4), fontFamily: FONTE, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: COR.ambar }}>INVENTÁRIO 3D</div>
        <div style={{ ...surge(f, 8), fontFamily: FONTE, fontWeight: 900, fontSize: 84, lineHeight: 1.05, color: "#fff", marginTop: 16 }}>Onde está<br />essa peça?</div>
      </div>
      <div style={{ position: "absolute", left: 100, right: 100, top: 560, background: "#F4F6F8", borderRadius: 24, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.5)", ...surge(f, 12, 80),
        transform: `${surge(f, 12, 80).transform} rotate(-2deg)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#1D6F42", color: "#fff", padding: "18px 26px", fontFamily: FONTE, fontWeight: 800, fontSize: 28 }}>
          <FaTableList /> almoxarifado_v7_FINAL.xlsx
        </div>
        {linhas.map((l, i) => (
          <div key={l} style={{ display: "flex", fontFamily: "monospace", fontSize: 30, color: "#334", borderBottom: "1px solid #D5DBE1",
            background: i === busca ? "#FFE8A3" : i % 2 ? "#fff" : "#EEF1F4" }}>
            <div style={{ width: 70, padding: "14px 0", textAlign: "center", color: "#99A", borderRight: "1px solid #D5DBE1" }}>{i + 2}</div>
            <div style={{ padding: "14px 20px", flex: 1 }}>{l}</div>
            <div style={{ padding: "14px 20px", width: 170, color: "#99A" }}>???</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 120, top: 1240, fontSize: 150, color: COR.ambar, opacity: surge(f, 16).opacity, transform: `${surge(f, 16).transform} rotate(${Math.sin(f / 6) * 12}deg)` }}>
        <FaMagnifyingGlass />
      </div>
      <div style={{ position: "absolute", left: 110, top: 1300, display: "flex", alignItems: "center", gap: 22, opacity: relogio, transform: `scale(${0.7 + 0.3 * relogio})`, transformOrigin: "left center" }}>
        <div style={{ fontSize: 96, color: COR.erro }}><FaClock /></div>
        <div style={{ fontFamily: FONTE, fontWeight: 900, fontSize: 52, color: "#fff", lineHeight: 1.1 }}>Linha<br />parada</div>
      </div>
    </Fundo>
  );
};

// ---------- palco: a tela do computador em destaque, com câmera ----------
// As telas foram capturadas em 1280×800 (px CSS). A câmera mostra um recorte (centro cx, cy e largura w, em px CSS)
// e a moldura muda de altura (a, em px do vídeo): baixa para a tela inteira, alta quando aproxima um detalhe.
// Pontos-chave: [quadro, cx, cy, w, a]. Com a omitida, a moldura usa a maior altura que cabe sem sobrar tela.
const SCR_L = 1280;
const SCR_A = 800;
const PAL_L = 1000;
const PAL_X = (LARG - PAL_L) / 2;
const PAL_CY = 985; // centro vertical da moldura
const PAL_MAX = 1060;
type Cam = [number, number, number, number, number?];
const altura = (w: number, a?: number) => Math.min(a ?? PAL_MAX, (SCR_A * PAL_L) / w, PAL_MAX);
const camera = (f: number, cam: Cam[]) => {
  const ponto = (c: Cam) => [c[1], c[2], c[3], altura(c[3], c[4])];
  let [cx, cy, w, a] = ponto(cam[0]);
  for (let i = 1; i < cam.length; i++) {
    const [fa] = cam[i - 1];
    const [fb] = cam[i];
    const A = ponto(cam[i - 1]);
    const B = ponto(cam[i]);
    if (f >= fb) { [cx, cy, w, a] = B; continue; }
    if (f > fa) {
      const t = Easing.inOut(Easing.cubic)((f - fa) / (fb - fa));
      [cx, cy, w, a] = A.map((v, k) => v + (B[k] - v) * t);
    }
    break;
  }
  const s = PAL_L / w;
  const h = a / s;
  const x0 = Math.max(0, Math.min(SCR_L - w, cx - w / 2));
  const y0 = Math.max(0, Math.min(SCR_A - h, cy - h / 2));
  return { s, x0, y0, a };
};

const Palco: React.FC<{ cam: Cam[]; children: React.ReactNode; extra?: (s: number) => React.ReactNode }> = ({ cam, children, extra }) => {
  const f = useCurrentFrame();
  const e = spring({ frame: f, fps: FPS, config: { damping: 18 } });
  const { s, x0, y0, a } = camera(f, cam);
  return (
    <div style={{ position: "absolute", left: PAL_X, top: PAL_CY - a / 2, width: PAL_L, height: a, borderRadius: 26, overflow: "hidden", background: "#07090D",
      boxShadow: `0 0 0 2px #2A3644, 0 0 60px rgba(245,158,11,.12), 0 40px 100px rgba(0,0,0,.7)`, opacity: e, transform: `scale(${0.94 + 0.06 * e})` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: SCR_L, height: SCR_A, transformOrigin: "0 0", transform: `scale(${s}) translate(${-x0}px, ${-y0}px)` }}>
        {children}
        {extra?.(s)}
      </div>
    </div>
  );
};

// Foco: escurece a tela em volta de um retângulo (px CSS) e contorna a área falada
type Area = { x: number; y: number; w: number; h: number; de: number; ate?: number };
const Foco: React.FC<{ s: number; areas: Area[] }> = ({ s, areas }) => {
  const f = useCurrentFrame();
  const k = 1 / s;
  return (
    <>
      {areas.map((r, i) => {
        const ate = r.ate ?? 1e9;
        const d = Math.min(8, (ate - r.de) / 3);
        const o = interpolate(f, [r.de, r.de + d, ate - d, ate], [0, 1, 1, 0], clamp);
        if (o <= 0) return null;
        const pad = 6 * k;
        return (
          <div key={i} style={{ position: "absolute", left: r.x - pad, top: r.y - pad, width: r.w + 2 * pad, height: r.h + 2 * pad, borderRadius: 10 * k, opacity: o,
            border: `${4 * k}px solid ${COR.ambar}`, boxShadow: `0 0 ${26 * k}px ${COR.ambar}, 0 0 0 4000px rgba(5,8,12,.62)` }} />
        );
      })}
    </>
  );
};

// Tela do computador (1280×800 px CSS) e sequência quadro a quadro
const TelaPc: React.FC<{ src: string; opacity?: number }> = ({ src, opacity = 1 }) => (
  <Img src={cap(`pc/${src}`)} style={{ position: "absolute", left: 0, top: 0, width: SCR_L, height: SCR_A, opacity }} />
);
const SeqPc: React.FC<{ pasta: string; n: number; de: number; vel?: number }> = ({ pasta, n, de, vel = 1 }) => {
  const f = useCurrentFrame();
  const k = Math.max(0, Math.min(n - 1, Math.floor((f - de) * vel)));
  return <TelaPc src={`${pasta}/${String(k).padStart(3, "0")}.jpg`} />;
};

// Ponteiro do mouse: vai até cada ponto [quadro, x, y] (px CSS) e clica nos quadros de `cliques`
const Ponteiro: React.FC<{ s: number; rota: [number, number, number][]; cliques?: number[] }> = ({ s, rota, cliques = [] }) => {
  const f = useCurrentFrame();
  let [, x, y] = rota[0];
  for (let i = 1; i < rota.length; i++) {
    const [fa, xa, ya] = rota[i - 1];
    const [fb, xb, yb] = rota[i];
    if (f >= fb) { [x, y] = [xb, yb]; continue; }
    if (f > fa) { const t = Easing.inOut(Easing.cubic)((f - fa) / (fb - fa)); [x, y] = [xa + (xb - xa) * t, ya + (yb - ya) * t]; }
    break;
  }
  const vis = interpolate(f, [rota[0][0] - 8, rota[0][0]], [0, 1], clamp);
  const k = 1 / s; // tamanho constante na tela, qualquer que seja o zoom
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: vis, pointerEvents: "none" }}>
      {cliques.map((c) => {
        const t = f - c;
        if (t < 0 || t > 16) return null;
        const r = interpolate(t, [0, 16], [8, 46]) * k;
        return <div key={c} style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `${4 * k}px solid ${COR.ambar}`, opacity: interpolate(t, [0, 16], [1, 0]) }} />;
      })}
      <svg width={34 * k} height={46 * k} viewBox="0 0 17 23" style={{ position: "absolute", left: -2 * k, top: -2 * k, filter: "drop-shadow(0 2px 3px rgba(0,0,0,.6))",
        transform: `scale(${cliques.some((c) => f >= c && f < c + 5) ? 0.85 : 1})`, transformOrigin: "0 0" }}>
        <path d="M1 1 L1 18 L5.5 13.8 L8.6 21 L11.6 19.7 L8.6 12.7 L14.5 12.7 Z" fill="#fff" stroke="#111" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const Rotulo: React.FC<{ s: number; x: number; y: number; texto: string; de: number; ate?: number }> = ({ s, x, y, texto, de, ate = 1e9 }) => {
  const f = useCurrentFrame();
  const o = spring({ frame: f - de, fps: FPS, config: { damping: 14 } }) * interpolate(f, [ate - 8, ate], [1, 0], clamp);
  const k = 1 / s;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) scale(${o})`, transformOrigin: "50% 100%", opacity: o, whiteSpace: "nowrap",
      fontFamily: FONTE, fontWeight: 900, fontSize: 30 * k, color: "#111", background: COR.ambar, padding: `${5 * k}px ${16 * k}px`, borderRadius: 10 * k,
      boxShadow: `0 ${6 * k}px ${18 * k}px rgba(0,0,0,.5)` }}>{texto}</div>
  );
};

const CHEIA = (f: number): Cam => [f, 640, 400, 1280];

const Geral: React.FC = () => {
  const f = useCurrentFrame();
  const clique = inicioFrase("geral", 1) + 4;
  const voo = clique + 4;
  return (
    <Fundo>
      <Titulo n={1} kicker="Visão geral" titulo="O almoxarifado inteiro em um mapa 3D" />
      <Palco cam={[CHEIA(0), CHEIA(26), [62, 990, 300, 700], [clique - 34, 990, 300, 700], [clique - 12, 380, 300, 760], [voo + 4, 380, 300, 760], CHEIA(voo + 34)]}
        extra={(s) => (<>
          <Foco s={s} areas={[{ x: 1040, y: 168, w: 100, h: 280, de: 50, ate: clique - 26 }, { x: 107, y: 55, w: 95, h: 28, de: clique - 14, ate: voo + 14 }]} />
          <Rotulo s={s} x={1090} y={150} texto="Corredor 1" de={56} ate={clique - 26} />
          <Ponteiro s={s} rota={[[clique - 24, 600, 330], [clique - 2, 154, 69], [voo + 30, 154, 69]]} cliques={[clique]} />
        </>)}>
        {f < voo ? <TelaPc src="geral.jpg" /> : <SeqPc pasta="voo-corredor1" n={N.voo} de={voo} />}
      </Palco>
      <Sequence from={clique} durationInFrames={10}><Audio src={sfx("tique")} volume={0.4} /></Sequence>
      <Aviso />
    </Fundo>
  );
};

const Busca: React.FC = () => {
  const ini = inicioFrase("busca", 0) + 14;
  const fim = inicioFrase("busca", 1) - 4;
  const passo = (fim - ini) / 11;
  return (
    <Fundo>
      <Titulo n={2} kicker="Busca" titulo="Digite o código, ache o endereço" />
      <Palco cam={[CHEIA(0), CHEIA(ini - 30), [ini - 8, 380, 220, 760]]}
        extra={(s) => (<>
          <Foco s={s} areas={[{ x: 117, y: 8, w: 562, h: 40, de: ini - 10, ate: fim + 4 }, { x: 14, y: 64, w: 570, h: 46, de: fim + 4 }]} />
          <Ponteiro s={s} rota={[[ini - 30, 640, 420], [ini - 10, 400, 30], [ini + 40, 400, 30]]} cliques={[ini - 8]} />
        </>)}>
        <SeqPc pasta="busca" n={12} de={ini} vel={1 / passo} />
      </Palco>
      {Array.from({ length: 11 }, (_, i) => (
        <Sequence key={i} from={Math.round(ini + (i + 1) * passo)} durationInFrames={6}><Audio src={sfx("tique")} volume={0.25} /></Sequence>
      ))}
      <Sequence from={fim + 4} durationInFrames={20}><Audio src={sfx("pop")} volume={0.4} /></Sequence>
      <Aviso />
    </Fundo>
  );
};

const Prateleira: React.FC = () => {
  const f = useCurrentFrame();
  const voo = 10;
  const t2 = inicioFrase("prateleira", 1);
  const tQuatro = quandoDiz("prateleira", "quatro");
  return (
    <Fundo>
      <Titulo n={3} kicker="Prateleira 01 01" titulo="Quatro andares, do A ao D" />
      <Palco cam={[CHEIA(0), CHEIA(voo + 50), [tQuatro - 4, ANDARES.cx, ANDARES.cy, ANDARES.w]]}
        extra={(s) => (<>
          <Foco s={s} areas={[{ x: 362, y: 186, w: 552, h: 520, de: tQuatro }]} />
          {ANDARES.y.map(([l, y], i) => {
            // os andares aparecem de baixo para cima, acompanhando a fala ("do A … até o D")
            const sp = spring({ frame: f - t2 - (3 - i) * 7, fps: FPS, config: { damping: 14 } });
            const k = 1 / s;
            return (
              <div key={l} style={{ position: "absolute", left: ANDARES.x - 78 * k, top: y - 30 * k, width: 60 * k, height: 60 * k, borderRadius: 30 * k, background: COR.ambar, color: "#111",
                fontFamily: FONTE, fontWeight: 900, fontSize: 34 * k, display: "flex", alignItems: "center", justifyContent: "center", opacity: sp, transform: `scale(${sp})`,
                boxShadow: "0 6px 16px rgba(0,0,0,.5)" }}>{l}</div>
            );
          })}
        </>)}>
        <SeqPc pasta="zoom-prateleira" n={N.zoom} de={voo - 6} />
        {f >= voo - 6 + N.zoom && <TelaPc src="prateleira.jpg" />}
      </Palco>
      <Aviso />
    </Fundo>
  );
};

const Caixa: React.FC = () => {
  const f = useCurrentFrame();
  const clique = 8;
  const voo = clique + 2;
  const painel = voo + 28;
  const P = PAINEL;
  const tEnd = Math.max(painel + 8, quandoDiz("caixa", "endere"));
  const tNome = quandoDiz("caixa", "nome");
  const tCod = quandoDiz("caixa", "códig");
  const tFoto = quandoDiz("caixa", "foto");
  const tEtq = inicioFrase("caixa", 1);
  const abreFoto = tFoto + 10;
  const tEtqF = quandoDiz("caixa", "etiqueta", 2);
  return (
    <Fundo>
      <Titulo n={4} kicker="Um clique na caixa" titulo="Endereço, nome, código e foto" />
      <Palco cam={[[0, 380, 220, 760], [voo + 4, 380, 220, 760], [painel, P.cx, P.cy, P.w], [abreFoto - 2, P.cx, P.cy, P.w], [abreFoto + 10, 640, 400, 1150],
          [tEtq - 8, 640, 400, 1150], [tEtq + 4, P.cx, P.cy, P.w], [tEtqF - 10, P.cx, P.cy, P.w], CHEIA(tEtqF + 2)]}
        extra={(s) => (<>
          <Foco s={s} areas={[
            { x: 14, y: 64, w: 570, h: 46, de: 0, ate: voo + 6 },
            { ...P.endereco, de: tEnd, ate: tNome },
            { ...P.nome, de: tNome, ate: tCod },
            { ...P.codigo, de: tCod, ate: tFoto },
            { ...P.foto, de: tFoto, ate: abreFoto },
            { ...P.foto, de: tEtq + 4, ate: tEtqF - 8 },
          ]} />
          <Ponteiro s={s} rota={[[0, 420, 160], [clique - 4, 250, 86], [painel, 250, 86], [abreFoto - 6, P.foto.x + 160, P.foto.y + 110], [tEtq - 2, P.foto.x + 160, P.foto.y + 110],
            [tEtq + 4, P.link[0], P.link[1]], [tEtqF - 2, P.foto.x + 160, P.foto.y + 110]]} cliques={[clique, abreFoto - 4, tEtq + 6, tEtqF + 2]} />
        </>)}>
        {f < voo ? <TelaPc src="busca-lista.jpg" /> : <SeqPc pasta="caixa" n={N.caixa} de={voo} vel={2} />}
        {f >= voo + N.caixa / 2 && <TelaPc src="caixa.jpg" />}
        {f >= abreFoto - 4 && f < tEtq + 6 && <TelaPc src="foto-peca.jpg" opacity={interpolate(f, [abreFoto - 4, abreFoto + 2], [0, 1], clamp)} />}
        {f >= tEtq + 6 && f < tEtqF + 2 && <TelaPc src="caixa-etiqueta.jpg" />}
        {f >= tEtqF + 2 && <TelaPc src="foto-etiqueta.jpg" opacity={interpolate(f, [tEtqF + 2, tEtqF + 8], [0, 1], clamp)} />}
      </Palco>
      {[clique, abreFoto - 4, tEtq + 6, tEtqF + 2].map((c) => <Sequence key={c} from={c} durationInFrames={10}><Audio src={sfx("tique")} volume={0.4} /></Sequence>)}
    </Fundo>
  );
};

const Cores: React.FC = () => {
  const f = useCurrentFrame();
  const cores = [
    { cor: COR.ok, nome: "Certo", diz: "verde" },
    { cor: COR.duvida, nome: "Dúvida", diz: "amarelo" },
    { cor: COR.erro, nome: "Erro", diz: "vermelho" },
    { cor: COR.normal, nome: "Não conferido", diz: "marrom" },
  ];
  const tVerde = quandoDiz("cores", "verde");
  return (
    <Fundo>
      <Titulo n={5} kicker="Conferência" titulo="Status de cada caixa pela cor" />
      <Palco cam={[CHEIA(0), CHEIA(tVerde - 14), [tVerde + 6, 420, 300, 700], [tVerde + 150, 900, 300, 700]]}
        extra={(s) => <Foco s={s} areas={[{ x: 10, y: 742, w: 300, h: 30, de: 14, ate: tVerde - 6 }]} />}>
        <TelaPc src="cores.jpg" />
      </Palco>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1540, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        {cores.map((c) => {
          const em = quandoDiz("cores", c.diz);
          const s = spring({ frame: f - em + 2, fps: FPS, config: { damping: 13 } });
          return (
            <div key={c.nome} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(10,14,20,.9)", border: `2px solid ${c.cor}`, borderRadius: 40,
              padding: "10px 22px", fontFamily: FONTE, fontWeight: 800, fontSize: 30, color: "#fff", opacity: s, transform: `scale(${0.6 + 0.4 * s})` }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: c.cor }} />{c.nome}
            </div>
          );
        })}
      </div>
      {cores.map((c) => (
        <Sequence key={c.nome} from={quandoDiz("cores", c.diz) - 2} durationInFrames={20}><Audio src={sfx("pop")} volume={0.35} /></Sequence>
      ))}
      <Aviso />
    </Fundo>
  );
};

const Plataformas: React.FC = () => {
  const f = useCurrentFrame();
  const pc = spring({ frame: f - 4, fps: FPS, config: { damping: 18 } });
  const cel = quandoDiz("plataformas", "celular");
  return (
    <Fundo>
      <Titulo n={6} kicker="Computador e celular" titulo="Tela grande no PC, versão para celular" />
      {/* notebook */}
      <div style={{ position: "absolute", left: 40, right: 40, top: 420, opacity: pc, transform: `translateY(${(1 - pc) * 60}px)` }}>
        <div style={{ background: "#05080C", borderRadius: "26px 26px 0 0", padding: 18, boxShadow: "0 0 0 3px #2A3644" }}>
          <Img src={cap("pc/caixa.jpg")} style={{ width: "100%", display: "block", borderRadius: 8 }} />
        </div>
        <div style={{ height: 34, margin: "0 -40px", background: "linear-gradient(#3A4656, #1C2430)", borderRadius: "0 0 30px 30px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 30, fontFamily: FONTE, fontWeight: 800, fontSize: 38, color: COR.texto }}>
          <FaComputer style={{ color: COR.azul }} /> Computador
        </div>
      </div>
      <Celular topo={1000} x={265} escala={0.5} entra={cel - 6}>
        <Tela src="caixa.jpg" />
      </Celular>
      <div style={{ position: "absolute", left: 80, top: 1300, display: "flex", alignItems: "center", gap: 14, fontFamily: FONTE, fontWeight: 800, fontSize: 38, color: COR.texto, ...surge(f, cel) }}>
        <FaMobileScreen style={{ color: COR.azul }} /> Celular
      </div>
      <div style={{ position: "absolute", left: 80, top: 1366, width: 440, fontFamily: FONTE, fontWeight: 600, fontSize: 30, color: COR.cinza, lineHeight: 1.35, ...surge(f, cel + 6) }}>
        Direto no navegador, sem instalar nada.
      </div>
    </Fundo>
  );
};

const Creditos: React.FC = () => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - 4, fps: FPS, config: { damping: 14 } });
  return (
    <Fundo>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
        <div style={{ width: 230, height: 230, borderRadius: 54, background: `linear-gradient(135deg, ${COR.ambar}, #B45309)`, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 120, color: "#111", transform: `scale(${s}) rotate(${(1 - s) * -20}deg)`, boxShadow: "0 30px 80px rgba(245,158,11,.35)" }}>
          <FaBoxOpen />
        </div>
        <div style={{ ...surge(f, 10), fontFamily: FONTE, fontWeight: 900, fontSize: 96, color: "#fff" }}>Inventário 3D</div>
        <div style={{ ...surge(f, 16), fontFamily: FONTE, fontWeight: 600, fontSize: 36, color: COR.cinza }}>Clique na caixa. Veja a peça.</div>
        <div style={{ ...surge(f, 30), marginTop: 70, textAlign: "center" }}>
          <div style={{ fontFamily: FONTE, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: COR.ambar }}>CRIADO POR</div>
          <div style={{ fontFamily: FONTE, fontWeight: 800, fontSize: 52, color: "#fff", marginTop: 14, lineHeight: 1.3 }}>Fábio Sarri<br />Eviton Capistrano</div>
        </div>
      </AbsoluteFill>
    </Fundo>
  );
};

const CENA: Record<string, React.FC> = { problema: Problema, geral: Geral, busca: Busca, prateleira: Prateleira, caixa: Caixa, cores: Cores, plataformas: Plataformas, creditos: Creditos };

// Troca de cena: faixa âmbar que varre a tela de baixo para cima
const Transicao: React.FC = () => {
  const f = useCurrentFrame();
  const y = interpolate(f, [0, 16], [2100, -2300], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: -200, right: -200, top: y, height: 2100, transform: "skewY(-12deg)", background: `linear-gradient(${COR.ambar} 0 6%, ${COR.fundo2} 6% 94%, ${COR.ambar} 94%)` }} />
    </AbsoluteFill>
  );
};

export const Inventario3D: React.FC = () => (
  <AbsoluteFill style={{ background: COR.fundo }}>
    <Audio src={sfx("trilha-leve")} loop volume={(f) => (f < 45 || f > DURACAO_TOTAL - 90 ? 0.2 : 0.08)} />
    {CENAS.map((c, i) => {
      const C = CENA[c.id];
      return (
        <Sequence key={c.id} from={INICIOS[i]} durationInFrames={c.duracao} name={c.id}>
          <C />
          <Legenda cena={c.id} />
          <Sequence from={ATRASO}><Audio src={arquivo(`inventario3d/audio/${c.id}.mp3`)} /></Sequence>
        </Sequence>
      );
    })}
    {INICIOS.slice(1).map((ini, i) => (
      <Sequence key={"t" + i} from={ini - 8} durationInFrames={17} name="transição">
        <Transicao />
        <Audio src={sfx("whoosh")} volume={0.25} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
