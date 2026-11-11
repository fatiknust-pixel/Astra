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
const N = { voo: 100, zoom: 85, caixa: 50, orbita: 80 };
const ANDARES = { cx: 640, cy: 400, w: 600, x: 480, y: [["D", 250], ["C", 330], ["B", 410], ["A", 490]] as const };
const LISTA = { x: 300, y: 75 };
const PAINEL = { cx: 1000, cy: 330, w: 560, foto: [1100, 150] as const, link: [1000, 228] as const };

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

// Sequência capturada do app: um arquivo por quadro (000.jpg, 001.jpg…), parada no último
const Seq: React.FC<{ pasta: string; n: number; de: number; vel?: number }> = ({ pasta, n, de, vel = 1 }) => {
  const f = useCurrentFrame();
  const k = Math.max(0, Math.min(n - 1, Math.floor((f - de) * vel)));
  return <Tela src={`${pasta}/${String(k).padStart(3, "0")}.jpg`} />;
};

// Toque na tela (círculo que se expande)
const Toque: React.FC<{ em: number; x: number; y: number }> = ({ em, x, y }) => {
  const f = useCurrentFrame();
  const t = f - em;
  if (t < 0 || t > 18) return null;
  const s = interpolate(t, [0, 18], [0.3, 1.4]);
  return (
    <div style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, width: 90, height: 90, marginLeft: -45, marginTop: -45, borderRadius: 45,
      border: "5px solid #fff", background: "rgba(255,255,255,.25)", transform: `scale(${s})`, opacity: interpolate(t, [0, 4, 18], [0, 1, 0]) }} />
  );
};

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

// ---------- janela do navegador (versão de computador) com câmera virtual ----------
// As telas foram capturadas em 1280×800 (px CSS). A câmera mostra um recorte (centro cx, cy e largura w,
// em px CSS) e anda entre pontos-chave [quadro, cx, cy, w].
const SCR_L = 1280;
const SCR_A = 800;
const JAN_X = 40;
const JAN_Y = 380;
const JAN_L = 1000;
const JAN_A = 1110;
const BARRA = 50;
type Cam = [number, number, number, number];
const camera = (f: number, cam: Cam[]) => {
  let [, cx, cy, w] = cam[0];
  for (let i = 1; i < cam.length; i++) {
    const [fa, xa, ya, wa] = cam[i - 1];
    const [fb, xb, yb, wb] = cam[i];
    if (f >= fb) { [cx, cy, w] = [xb, yb, wb]; continue; }
    if (f > fa) {
      const t = Easing.inOut(Easing.cubic)((f - fa) / (fb - fa));
      [cx, cy, w] = [xa + (xb - xa) * t, ya + (yb - ya) * t, wa + (wb - wa) * t];
    }
    break;
  }
  const s = JAN_L / w;
  const h = JAN_A / s;
  const x0 = Math.max(0, Math.min(SCR_L - w, cx - w / 2));
  const y0 = h >= SCR_A ? (SCR_A - h) / 2 : Math.max(0, Math.min(SCR_A - h, cy - h / 2));
  return { s, x0, y0 };
};

const Janela: React.FC<{ cam: Cam[]; children: React.ReactNode; extra?: (s: number) => React.ReactNode }> = ({ cam, children, extra }) => {
  const f = useCurrentFrame();
  const e = spring({ frame: f, fps: FPS, config: { damping: 18 } });
  const { s, x0, y0 } = camera(f, cam);
  return (
    <div style={{ position: "absolute", left: JAN_X, top: JAN_Y, width: JAN_L, borderRadius: 22, overflow: "hidden", background: "#10151c",
      boxShadow: "0 0 0 3px #2A3644, 0 40px 90px rgba(0,0,0,.6)", opacity: e, transform: `translateY(${(1 - e) * 60}px)` }}>
      <div style={{ height: BARRA, background: "#1B2430", display: "flex", alignItems: "center", gap: 10, padding: "0 20px" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
        <div style={{ marginLeft: 18, flex: 1, height: 30, borderRadius: 15, background: "#0F151D", color: COR.cinza, fontFamily: FONTE, fontWeight: 600, fontSize: 18,
          display: "flex", alignItems: "center", padding: "0 16px" }}>Inventário 3D</div>
      </div>
      <div style={{ position: "relative", height: JAN_A, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: SCR_L, height: SCR_A, transformOrigin: "0 0", transform: `scale(${s}) translate(${-x0}px, ${-y0}px)` }}>
          {children}
          {extra?.(s)}
        </div>
      </div>
    </div>
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

// Moldura de destaque (px CSS)
const Destaque: React.FC<{ s: number; x: number; y: number; w: number; h: number; de: number; ate?: number; rotulo?: string }> = ({ s, x, y, w, h, de, ate = 1e9, rotulo }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [de, de + 8, ate - 6, ate], [0, 1, 1, 0], clamp);
  const k = 1 / s;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 10 * k, border: `${5 * k}px solid ${COR.ambar}`,
      boxShadow: `0 0 ${24 * k}px ${COR.ambar}`, opacity: o * (0.75 + 0.25 * Math.abs(Math.sin(f / 7))) }}>
      {rotulo && <div style={{ position: "absolute", left: "50%", bottom: "100%", transform: "translateX(-50%)", marginBottom: 8 * k, whiteSpace: "nowrap", fontFamily: FONTE, fontWeight: 900,
        fontSize: 30 * k, color: "#111", background: COR.ambar, padding: `${4 * k}px ${14 * k}px`, borderRadius: 8 * k }}>{rotulo}</div>}
    </div>
  );
};

const Geral: React.FC = () => {
  const f = useCurrentFrame();
  const clique = inicioFrase("geral", 1) + 4;
  const voo = clique + 4;
  return (
    <Fundo>
      <Titulo n={1} kicker="Visão geral" titulo="O almoxarifado inteiro em um mapa 3D" />
      <Janela cam={[[0, 640, 400, 1280], [30, 640, 400, 1280], [clique - 26, 330, 300, 700], [voo + 8, 330, 300, 700], [voo + 60, 640, 420, 714]]}
        extra={(s) => (<>
          <Destaque s={s} x={1035} y={165} w={110} h={290} de={14} ate={clique - 22} rotulo="Corredor 1" />
          <Ponteiro s={s} rota={[[clique - 26, 520, 300], [clique - 2, 154, 69], [voo + 30, 154, 69]]} cliques={[clique]} />
        </>)}>
        {f < voo ? <TelaPc src="geral.jpg" /> : <SeqPc pasta="voo-corredor1" n={N.voo} de={voo} />}
      </Janela>
      <Sequence from={clique} durationInFrames={10}><Audio src={sfx("tique")} volume={0.4} /></Sequence>
      <Aviso />
    </Fundo>
  );
};

const Busca: React.FC = () => {
  const f = useCurrentFrame();
  const ini = inicioFrase("busca", 0) + 14;
  const fim = inicioFrase("busca", 1) - 4;
  const passo = (fim - ini) / 11;
  return (
    <Fundo>
      <Titulo n={2} kicker="Busca" titulo="Digite o código, ache o endereço" />
      <Janela cam={[[0, 640, 420, 714], [ini - 4, 380, 150, 560]]}
        extra={(s) => <Ponteiro s={s} rota={[[2, 640, 420], [ini - 8, 300, 28]]} cliques={[ini - 6]} />}>
        <SeqPc pasta="busca" n={12} de={ini} vel={1 / passo} />
      </Janela>
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
  return (
    <Fundo>
      <Titulo n={3} kicker="Prateleira 01 01" titulo="Quatro andares, do A ao D" />
      <Janela cam={[[0, 640, 420, 714], [voo + 70, 640, 420, 714], [t2 - 6, ANDARES.cx, ANDARES.cy, ANDARES.w]]}
        extra={(s) => ANDARES.y.map(([l, y], i) => {
          // os andares aparecem de baixo para cima, acompanhando a fala ("do A … até o D")
          const sp = spring({ frame: f - t2 - (3 - i) * 6, fps: FPS, config: { damping: 14 } });
          const k = 1 / s;
          return (
            <div key={l} style={{ position: "absolute", left: ANDARES.x - 70 * k, top: y - 30 * k, width: 60 * k, height: 60 * k, borderRadius: 30 * k, background: COR.ambar, color: "#111",
              fontFamily: FONTE, fontWeight: 900, fontSize: 34 * k, display: "flex", alignItems: "center", justifyContent: "center", opacity: sp, transform: `scale(${sp})`,
              boxShadow: "0 6px 16px rgba(0,0,0,.5)" }}>{l}</div>
          );
        })}>
        <SeqPc pasta="zoom-prateleira" n={N.zoom} de={voo} />
        {f >= voo + N.zoom && <TelaPc src="prateleira.jpg" />}
      </Janela>
      <Aviso />
    </Fundo>
  );
};

const Caixa: React.FC = () => {
  const f = useCurrentFrame();
  const clique = 16;
  const voo = clique + 2;
  const tFoto = quandoDiz("caixa", "foto");
  const tEtq = inicioFrase("caixa", 1);
  const P = PAINEL;
  return (
    <Fundo>
      <Titulo n={4} kicker="Um clique na caixa" titulo="Endereço, nome, código e foto" />
      <Janela cam={[[0, LISTA.x, LISTA.y + 60, 600], [voo + 30, 640, 420, 714], [voo + 50, P.cx, P.cy, P.w], [tFoto - 10, P.cx, P.cy, P.w], [tFoto + 4, 640, 400, 714],
          [tEtq - 14, 640, 400, 714], [tEtq - 2, P.cx, P.cy, P.w], [tEtq + 10, P.cx, P.cy, P.w], [tEtq + 22, 640, 400, 714]]}
        extra={(s) => <Ponteiro s={s} rota={[[0, LISTA.x + 120, LISTA.y + 50], [clique - 4, LISTA.x, LISTA.y], [voo + 40, LISTA.x, LISTA.y], [tFoto - 12, P.foto[0], P.foto[1]],
          [tEtq - 16, P.foto[0], P.foto[1]], [tEtq - 6, P.link[0], P.link[1]], [tEtq + 6, P.foto[0], P.foto[1]]]} cliques={[clique, tFoto - 8, tEtq - 4, tEtq + 8]} />}>
        {f < voo ? <TelaPc src="busca-lista.jpg" /> : <SeqPc pasta="caixa" n={N.caixa} de={voo} />}
        {f >= voo + N.caixa && <TelaPc src="caixa.jpg" />}
        {f >= tFoto - 8 && f < tEtq - 4 && <TelaPc src="foto-peca.jpg" opacity={interpolate(f, [tFoto - 8, tFoto - 2], [0, 1], clamp)} />}
        {f >= tEtq - 4 && f < tEtq + 8 && <TelaPc src="caixa-etiqueta.jpg" />}
        {f >= tEtq + 8 && <TelaPc src="foto-etiqueta.jpg" opacity={interpolate(f, [tEtq + 8, tEtq + 14], [0, 1], clamp)} />}
      </Janela>
      {[clique, tFoto - 8, tEtq - 4, tEtq + 8].map((c) => <Sequence key={c} from={c} durationInFrames={10}><Audio src={sfx("tique")} volume={0.4} /></Sequence>)}
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
  return (
    <Fundo>
      <Titulo n={5} kicker="Conferência" titulo="Status de cada caixa pela cor" />
      <Janela cam={[[0, 640, 420, 714]]}>
        <SeqPc pasta="orbita" n={N.orbita} de={6} vel={0.6} />
      </Janela>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1560, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
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
