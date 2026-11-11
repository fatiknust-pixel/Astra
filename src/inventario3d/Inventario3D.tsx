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

const Geral: React.FC = () => {
  const f = useCurrentFrame();
  const voo = inicioFrase("geral", 1) + 12;
  return (
    <Fundo>
      <Titulo n={1} kicker="Visão geral" titulo="O almoxarifado inteiro em um mapa 3D" />
      <Celular>
        {f < voo ? <Tela src="geral.jpg" /> : <Seq pasta="voo-corredor1" n={86} de={voo} />}
        {f >= voo + 86 && <Tela src="corredor1.jpg" />}
        <Toque em={voo - 10} x={0.33} y={0.088} />
      </Celular>
      {/* destaque do corredor 1 na visão geral, antes do voo */}
      {f < voo && (
        <div style={{ position: "absolute", left: (LARG - TELA_L) / 2 + TELA_L * 0.43, top: 370 + 16 + TELA_A * 0.789 - 34, width: TELA_L * 0.44, height: 68, borderRadius: 14,
          border: `5px solid ${COR.ambar}`, boxShadow: `0 0 30px ${COR.ambar}`, opacity: interpolate(f, [20, 30], [0, 0.6 + 0.4 * Math.abs(Math.sin(f / 8))], clamp) }}>
          <div style={{ position: "absolute", right: -10, top: -60, fontFamily: FONTE, fontWeight: 800, fontSize: 30, color: COR.ambar, whiteSpace: "nowrap" }}>Corredor 1</div>
        </div>
      )}
      <Aviso />
    </Fundo>
  );
};

const Busca: React.FC = () => {
  const f = useCurrentFrame();
  const ini = inicioFrase("busca", 0) + 18;
  const fim = inicioFrase("busca", 1) - 4;
  const z = interpolate(f, [ini - 12, ini + 6], [1, 1.18], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const passo = (fim - ini) / 11;
  return (
    <Fundo>
      <Titulo n={2} kicker="Busca" titulo="Digite o código, ache o endereço" />
      <Celular zoom={z} origem="50% 0%">
        <Seq pasta="busca" n={12} de={ini} vel={1 / passo} />
      </Celular>
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
  const voo = 14;
  const andares = [["D", 0.261], ["C", 0.346], ["B", 0.429], ["A", 0.504]] as const;
  const t2 = inicioFrase("prateleira", 1);
  return (
    <Fundo>
      <Titulo n={3} kicker="Prateleira 01 01" titulo="Quatro andares, do A ao D" />
      <Celular>
        <Seq pasta="zoom-prateleira" n={85} de={voo} />
        {f >= voo + 85 && <Tela src="prateleira-final.jpg" />}
        <Toque em={voo - 8} x={0.87} y={0.068} />
      </Celular>
      {andares.map(([l, y], i) => {
        // os andares aparecem de baixo para cima, acompanhando a fala ("do A … até o D")
        const em = t2 + i * 6;
        const s = spring({ frame: f - em - (3 - i) * 6 + 18, fps: FPS, config: { damping: 14 } });
        return (
          <div key={l} style={{ position: "absolute", left: (LARG - TELA_L) / 2 - 92, top: 370 + 16 + TELA_A * y - 34, width: 68, height: 68, borderRadius: 34,
            background: COR.ambar, color: "#111", fontFamily: FONTE, fontWeight: 900, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center",
            opacity: s, transform: `scale(${s})`, boxShadow: "0 8px 20px rgba(0,0,0,.4)" }}>
            {l}
          </div>
        );
      })}
    </Fundo>
  );
};

const Caixa: React.FC = () => {
  const f = useCurrentFrame();
  const voo = 10;
  const tFoto = quandoDiz("caixa", "foto");
  const tEtq = inicioFrase("caixa", 1);
  const z = interpolate(f, [voo + 40, voo + 56], [1, 1.12], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const ampliaFoto = f >= tFoto - 4 && f < tEtq - 6;
  return (
    <Fundo>
      <Titulo n={4} kicker="Um toque na caixa" titulo="Endereço, nome, código e foto" />
      <Celular zoom={ampliaFoto || f >= tEtq + 8 ? 1 : z} origem="50% 100%">
        <Seq pasta="caixa" n={44} de={voo} />
        {f >= voo + 44 && <Tela src="caixa.jpg" />}
        {ampliaFoto && <Tela src="foto-peca.jpg" opacity={interpolate(f, [tFoto - 4, tFoto + 4], [0, 1], clamp)} />}
        {f >= tEtq - 6 && f < tEtq + 8 && <Tela src="etiqueta.jpg" />}
        {f >= tEtq + 8 && <Tela src="foto-etiqueta.jpg" opacity={interpolate(f, [tEtq + 8, tEtq + 16], [0, 1], clamp)} />}
        <Toque em={voo - 8} x={0.5} y={0.36} />
        <Toque em={tFoto - 8} x={0.14} y={0.73} />
        <Toque em={tEtq - 10} x={0.14} y={0.79} />
      </Celular>
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
      <Celular topo={400} escala={0.92}>
        <Seq pasta="orbita" n={75} de={6} vel={0.6} />
        {f >= 136 && <Tela src="prateleira-cores.jpg" opacity={interpolate(f, [136, 150], [0, 1], clamp)} />}
      </Celular>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1572, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
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
  const pc = spring({ frame: f - 6, fps: FPS, config: { damping: 18 } });
  return (
    <Fundo>
      <Titulo n={6} kicker="Celular e PC" titulo="Funciona onde você estiver" />
      {/* notebook */}
      <div style={{ position: "absolute", left: 40, right: 40, top: 470, opacity: pc, transform: `translateY(${(1 - pc) * 60}px)` }}>
        <div style={{ background: "#05080C", borderRadius: "26px 26px 0 0", padding: 18, boxShadow: "0 0 0 3px #2A3644" }}>
          <Img src={cap("pc-caixa.jpg")} style={{ width: "100%", display: "block", borderRadius: 8 }} />
        </div>
        <div style={{ height: 34, margin: "0 -40px", background: "linear-gradient(#3A4656, #1C2430)", borderRadius: "0 0 30px 30px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26, fontFamily: FONTE, fontWeight: 800, fontSize: 34, color: COR.texto }}>
          <FaComputer style={{ color: COR.azul }} /> Computador
        </div>
      </div>
      <Celular topo={1000} x={250} escala={0.62} entra={14}>
        <Tela src="caixa.jpg" />
      </Celular>
      <div style={{ position: "absolute", left: 80, top: 1240, display: "flex", alignItems: "center", gap: 14, fontFamily: FONTE, fontWeight: 800, fontSize: 34, color: COR.texto, ...surge(f, 18) }}>
        <FaMobileScreen style={{ color: COR.azul }} /> Celular
      </div>
      <div style={{ position: "absolute", left: 80, top: 1310, width: 420, fontFamily: FONTE, fontWeight: 600, fontSize: 30, color: COR.cinza, lineHeight: 1.35, ...surge(f, 24) }}>
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
