// Vídeo de apresentação do site da Bianca Dammenhain (16:9, sem narração nem legenda).
// Telas capturadas do site em public/bianca/cap (página inteira no PC e no celular, mais estados: galeria, filtro,
// foto ampliada, menu). Efeitos e trilha sintetizados em public/bianca/sfx.
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, spring, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { arquivo } from "../dados";

loadFont({ family: "Archivo", url: arquivo("bianca/fontes/archivo.woff2"), format: "woff2", weight: "100 900", stretch: "62% 125%" } as any);
loadFont({ family: "Hanken", url: arquivo("bianca/fontes/hanken.woff2"), format: "woff2", weight: "100 900" } as any);

export const FPS = 30;
export const LARG = 1920;
export const ALT = 1080;

// Paleta do próprio site
const C = { tinta: "#100c12", tinta2: "#1a141c", osso: "#f2ebe3", nevoa: "#b5aab0", rosa: "#ff7ab5" };
const TITULO: React.CSSProperties = { fontFamily: "Archivo, sans-serif", fontWeight: 800, fontStretch: "125%", color: C.osso };
const TEXTO: React.CSSProperties = { fontFamily: "Hanken, sans-serif", color: C.nevoa };
const URL_SITE = "biancatatuadora.com.br";

const cap = (p: string) => arquivo(`bianca/cap/${p}`);
const sfx = (n: string) => arquivo(`bianca/sfx/${n}.mp3`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);

// Cenas (quadros)
const T = { intro: 0, hero: 150, rola: 300, galeria: 585, celular: 810, juntos: 1080, fim: 1185 };
export const DURACAO = 1320;

// Interpola entre pontos-chave [quadro, valor] com suavização
const chave = (f: number, pts: [number, number][], e = ease) => {
  if (f <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [fa, va] = pts[i - 1];
    const [fb, vb] = pts[i];
    if (f <= fb) return va + (vb - va) * e((f - fa) / (fb - fa));
  }
  return pts[pts.length - 1][1];
};

// ---------- peças ----------
const Fundo: React.FC<{ brilho?: number }> = ({ brilho = 1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.tinta }}>
      <AbsoluteFill style={{ opacity: 0.55 * brilho, background: `radial-gradient(circle at ${50 + 18 * Math.sin(f / 90)}% ${45 + 10 * Math.cos(f / 70)}%, rgba(255,122,181,.28), transparent 45%)` }} />
      <AbsoluteFill style={{ opacity: 0.35 * brilho, background: `radial-gradient(circle at ${20 + 10 * Math.cos(f / 80)}% 85%, rgba(140,90,255,.18), transparent 40%)` }} />
      <Poeira />
    </AbsoluteFill>
  );
};

// Partículas de "glitter" flutuando
const Poeira: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({ length: 46 }, (_, i) => {
        const r = (n: number) => (Math.sin(i * 127.1 + n * 311.7) * 43758.5453) % 1;
        const x = (Math.abs(r(1)) * LARG + f * (0.15 + Math.abs(r(2)) * 0.4)) % LARG;
        const y = (Math.abs(r(3)) * ALT - f * (0.2 + Math.abs(r(4)) * 0.5) + ALT * 4) % ALT;
        const s = 1.5 + Math.abs(r(5)) * 3;
        const o = 0.15 + 0.5 * Math.abs(Math.sin(f / (12 + Math.abs(r(6)) * 20) + i));
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: s, background: i % 3 ? C.rosa : C.osso, opacity: o, boxShadow: `0 0 ${s * 3}px ${C.rosa}` }} />;
      })}
    </AbsoluteFill>
  );
};

// Janela de navegador escura com a barra de endereço
const Navegador: React.FC<{ largura: number; altura: number; children: React.ReactNode; url?: React.ReactNode; style?: React.CSSProperties }> = ({ largura, altura, children, url, style }) => (
  <div style={{ position: "absolute", width: largura, height: altura + 52, borderRadius: 18, overflow: "hidden", background: C.tinta2,
    boxShadow: "0 0 0 1.5px rgba(255,255,255,.08), 0 50px 120px rgba(0,0,0,.65), 0 0 80px rgba(255,122,181,.12)", ...style }}>
    <div style={{ height: 52, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: "#1d171f", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
      <div style={{ marginLeft: 22, flex: 1, maxWidth: 620, height: 32, borderRadius: 16, background: C.tinta, display: "flex", alignItems: "center", gap: 10, padding: "0 16px",
        ...TEXTO, fontSize: 18, color: C.osso }}>
        <Cadeado /> {url ?? URL_SITE}
      </div>
    </div>
    <div style={{ position: "relative", width: largura, height: altura, overflow: "hidden" }}>{children}</div>
  </div>
);
const Cadeado: React.FC = () => (
  <svg width="14" height="16" viewBox="0 0 14 16"><rect x="1" y="7" width="12" height="9" rx="2" fill={C.nevoa} /><path d="M4 7V5a3 3 0 0 1 6 0v2" stroke={C.nevoa} strokeWidth="2" fill="none" /></svg>
);

// Celular com a tela (largura em px do vídeo; telas capturadas em 390 px CSS)
const Celular: React.FC<{ largura: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ largura, children, style }) => {
  const k = largura / 390;
  const altura = 844 * k;
  return (
    <div style={{ position: "absolute", width: largura + 28 * k, height: altura + 28 * k, padding: 14 * k, borderRadius: 64 * k, background: "#0a080b",
      boxShadow: `0 0 0 ${2.5 * k}px #3a3340, 0 40px 100px rgba(0,0,0,.7), 0 0 70px rgba(255,122,181,.18)`, ...style }}>
      <div style={{ position: "relative", width: largura, height: altura, borderRadius: 50 * k, overflow: "hidden", background: C.tinta }}>
        {children}
        <div style={{ position: "absolute", left: "50%", top: 11 * k, width: 120 * k, height: 34 * k, marginLeft: -60 * k, borderRadius: 20 * k, background: "#000" }} />
      </div>
    </div>
  );
};

// Ponteiro do mouse com clique
const Ponteiro: React.FC<{ rota: [number, number, number][]; cliques?: number[]; escala?: number }> = ({ rota, cliques = [], escala = 1 }) => {
  const f = useCurrentFrame();
  const x = chave(f, rota.map(([q, x]) => [q, x] as [number, number]));
  const y = chave(f, rota.map(([q, , y]) => [q, y] as [number, number]));
  const vis = interpolate(f, [rota[0][0] - 6, rota[0][0]], [0, 1], clamp);
  const k = escala;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: vis, pointerEvents: "none" }}>
      {cliques.map((c) => {
        const t = f - c;
        if (t < 0 || t > 18) return null;
        const r = interpolate(t, [0, 18], [6, 50]) * k;
        return <div key={c} style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `${3 * k}px solid ${C.rosa}`, opacity: interpolate(t, [0, 18], [1, 0]) }} />;
      })}
      <svg width={30 * k} height={40 * k} viewBox="0 0 17 23" style={{ position: "absolute", left: -2 * k, top: -2 * k, filter: "drop-shadow(0 3px 4px rgba(0,0,0,.6))",
        transform: `scale(${cliques.some((c) => f >= c && f < c + 5) ? 0.82 : 1})`, transformOrigin: "0 0" }}>
        <path d="M1 1 L1 18 L5.5 13.8 L8.6 21 L11.6 19.7 L8.6 12.7 L14.5 12.7 Z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// Clarão branco/rosa no corte
const Clarao: React.FC<{ em: number; dur?: number }> = ({ em, dur = 14 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [em, em + 2, em + dur], [0, 0.9, 0], clamp);
  return o > 0 ? <AbsoluteFill style={{ background: `radial-gradient(circle, #fff 0%, ${C.rosa} 55%, transparent 100%)`, opacity: o, mixBlendMode: "screen" }} /> : null;
};

// Palavra gigante vazada ao fundo (parallax)
const Gigante: React.FC<{ texto: string; de: number; ate: number; y?: number }> = ({ texto, de, ate, y = 160 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [de, de + 12, ate - 12, ate], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: y, whiteSpace: "nowrap", ...TITULO, fontSize: 300, lineHeight: 1, color: "transparent",
      WebkitTextStroke: "2px rgba(255,122,181,.22)", opacity: o, transform: `translateX(${120 - (f - de) * 2.2}px)` }}>{texto}</div>
  );
};

// ---------- cenas ----------
// 1. Barra de endereço sendo digitada
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const ini = 34;
  const passo = 3;
  const n = Math.max(0, Math.min(URL_SITE.length, Math.floor((f - ini) / passo) + 1));
  const enter = ini + URL_SITE.length * passo + 14;
  const barra = spring({ frame: f - 6, fps: FPS, config: { damping: 16 } });
  const empurra = interpolate(f, [enter, enter + 4, enter + 10], [1, 0.96, 1.02], clamp);
  const sai = interpolate(f, [T.hero - 14, T.hero], [1, 0], clamp);
  const zoom = interpolate(f, [enter + 6, T.hero], [1, 2.6], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Fundo brilho={0.7} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: sai, transform: `scale(${zoom})` }}>
        <div style={{ ...TEXTO, fontSize: 22, letterSpacing: 8, color: C.nevoa, marginBottom: 34, opacity: interpolate(f, [10, 30], [0, 0.8], clamp) }}>APRESENTANDO</div>
        <div style={{ width: 980, height: 96, borderRadius: 48, background: "rgba(26,20,28,.92)", display: "flex", alignItems: "center", gap: 22, padding: "0 40px",
          boxShadow: `0 0 0 1.5px rgba(255,122,181,${0.25 + 0.35 * barra}), 0 0 ${60 * barra}px rgba(255,122,181,.35), 0 30px 80px rgba(0,0,0,.6)`,
          transform: `scale(${(0.8 + 0.2 * barra) * empurra})`, opacity: barra }}>
          <svg width="30" height="30" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="7" stroke={C.nevoa} strokeWidth="2.4" fill="none" /><path d="M16 16 L21 21" stroke={C.nevoa} strokeWidth="2.6" strokeLinecap="round" /></svg>
          <div style={{ ...TEXTO, fontSize: 46, fontWeight: 500, color: C.osso, letterSpacing: 0.5 }}>
            {URL_SITE.slice(0, n)}
            <span style={{ display: "inline-block", width: 3, height: 50, marginLeft: 4, verticalAlign: "middle", background: C.rosa, opacity: Math.floor(f / 8) % 2 || f < enter ? 1 : 0 }} />
          </div>
          <div style={{ marginLeft: "auto", ...TEXTO, fontSize: 20, color: C.tinta, background: C.osso, padding: "10px 18px", borderRadius: 24, opacity: interpolate(f, [enter - 10, enter - 4], [0, 1], clamp),
            transform: `scale(${f >= enter && f < enter + 5 ? 0.9 : 1})` }}>Enter ↵</div>
        </div>
      </AbsoluteFill>
      {Array.from({ length: URL_SITE.length }, (_, i) => (
        <Sequence key={i} from={ini + i * passo} durationInFrames={6}><Audio src={sfx(`tecla${(i * 7) % 6 + 1}`)} volume={0.55} /></Sequence>
      ))}
      <Sequence from={enter} durationInFrames={10}><Audio src={sfx("enter")} volume={0.8} /></Sequence>
      <Sequence from={enter - 40} durationInFrames={80}><Audio src={sfx("riser")} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};

// 2. O site aparece (hero) com impacto
const Hero: React.FC = () => {
  const f = useCurrentFrame();
  const e = spring({ frame: f, fps: FPS, config: { damping: 22, mass: 0.8 } });
  const z = interpolate(f, [0, 150], [1.06, 0.97], { ...clamp, easing: Easing.out(Easing.cubic) });
  const L = 1500;
  return (
    <AbsoluteFill>
      <Fundo />
      <Navegador largura={L} altura={L * 900 / 1440} style={{ left: (LARG - L) / 2, top: (ALT - L * 900 / 1440 - 52) / 2, transform: `scale(${(0.7 + 0.3 * e) * z})`, opacity: e }}>
        <Img src={cap("pc-hero.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* brilho passando sobre o título */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, transparent ${interpolate(f, [30, 75], [-20, 110], clamp)}%, rgba(255,255,255,.22) ${interpolate(f, [30, 75], [-10, 120], clamp)}%, transparent ${interpolate(f, [30, 75], [0, 130], clamp)}%)` }} />
      </Navegador>
      <Clarao em={0} dur={16} />
      <Audio src={sfx("impacto")} volume={0.9} />
      <Audio src={sfx("whoosh")} volume={0.5} />
      <Sequence from={40}><Audio src={sfx("brilho")} volume={0.55} /></Sequence>
    </AbsoluteFill>
  );
};

// 3. Rolagem pela página inteira, com a janela em perspectiva
const PARADAS: [number, number][] = [[0, 0], [20, 0], [62, 900], [100, 900], [140, 1480], [170, 1480], [205, 2586], [235, 2586], [262, 3523], [282, 3523]];
const Rola: React.FC = () => {
  const f = useCurrentFrame();
  const L = 1300;
  const A = L * 900 / 1440;
  const k = L / 1440; // px do vídeo por px CSS
  const y = chave(f, PARADAS);
  const e = spring({ frame: f, fps: FPS, config: { damping: 20 } });
  const giro = interpolate(f, [0, 285], [-16, -6], clamp);
  return (
    <AbsoluteFill>
      <Fundo />
      <Gigante texto="TRABALHOS" de={50} ate={175} />
      <Gigante texto="COBERTURAS" de={190} ate={250} y={560} />
      <Gigante texto="SOBRE A BIANCA" de={250} ate={300} />
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div style={{ position: "absolute", left: 300, top: (ALT - A - 52) / 2, transform: `rotateY(${giro}deg) rotateX(4deg) translateZ(${-60 + 60 * e}px)`, transformStyle: "preserve-3d", opacity: e }}>
          <Navegador largura={L} altura={A}>
            <Img src={cap("pc-pagina.jpg")} style={{ position: "absolute", left: 0, top: -y * k, width: L }} />
          </Navegador>
        </div>
      </AbsoluteFill>
      {PARADAS.filter((_, i) => i % 2 === 1 && i > 1).map(([q]) => (
        <Sequence key={q} from={q - 40} durationInFrames={25}><Audio src={sfx("whoosh-curto")} volume={0.35} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};

// 4. Galeria: filtro "Glitter" e uma foto ampliada
const Galeria: React.FC = () => {
  const f = useCurrentFrame();
  const L = 1680;
  const A = L * 900 / 1440;
  const k = L / 1440;
  const cliqueFiltro = 46;
  const cliqueFoto = 112;
  const tela = f < cliqueFiltro + 3 ? "pc-trabalhos.jpg" : f < cliqueFoto + 3 ? "pc-filtro-glitter.jpg" : "pc-lightbox.jpg";
  const zoom = f < cliqueFoto + 3 ? interpolate(f, [0, cliqueFoto], [1, 1.12], clamp) : interpolate(f, [cliqueFoto + 3, 225], [1.06, 1.16], clamp);
  const ox = f < cliqueFoto + 3 ? interpolate(f, [0, cliqueFoto], [0, 60], clamp) : 0;
  const e = spring({ frame: f, fps: FPS, config: { damping: 20 } });
  const foto = spring({ frame: f - cliqueFoto - 3, fps: FPS, config: { damping: 15 } });
  return (
    <AbsoluteFill>
      <Fundo />
      <Navegador largura={L} altura={A} style={{ left: (LARG - L) / 2, top: (ALT - A - 52) / 2, opacity: e, transform: `scale(${0.9 + 0.1 * e})` }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom}) translateX(${ox}px)`, transformOrigin: f < cliqueFoto + 3 ? "20% 40%" : "50% 50%" }}>
          <Img src={cap(tela)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: tela === "pc-lightbox.jpg" ? 0.4 + 0.6 * foto : 1 }} />
          <Ponteiro escala={1 / zoom} rota={[[8, 900 * k, 600 * k], [cliqueFiltro - 4, 222 * k, 322 * k], [cliqueFiltro + 20, 300 * k, 420 * k], [cliqueFoto - 4, 412 * k, 535 * k], [cliqueFoto + 30, 412 * k, 535 * k]]}
            cliques={[cliqueFiltro, cliqueFoto]} />
        </div>
      </Navegador>
      <Clarao em={cliqueFoto + 2} dur={10} />
      {[cliqueFiltro, cliqueFoto].map((c) => <Sequence key={c} from={c} durationInFrames={10}><Audio src={sfx("clique")} volume={0.8} /></Sequence>)}
      <Sequence from={cliqueFiltro + 2}><Audio src={sfx("brilho")} volume={0.5} /></Sequence>
      <Sequence from={cliqueFoto + 2} durationInFrames={30}><Audio src={sfx("whoosh-curto")} volume={0.45} /></Sequence>
    </AbsoluteFill>
  );
};

// 5. Celular: três aparelhos, o do meio rolando a página
const CEL_PARADAS: [number, number][] = [[0, 0], [30, 0], [70, 844], [110, 844], [150, 1700], [180, 1700], [215, 2672], [245, 2672], [270, 3663]];
const CelularCena: React.FC = () => {
  const f = useCurrentFrame();
  const w = 380;
  const k = w / 390;
  const y = chave(f, CEL_PARADAS);
  const meio = spring({ frame: f, fps: FPS, config: { damping: 18 } });
  const lados = spring({ frame: f - 30, fps: FPS, config: { damping: 18 } });
  const topo = (ALT - 844 * k - 28 * k) / 2;
  return (
    <AbsoluteFill>
      <Fundo />
      <Gigante texto="NO CELULAR" de={0} ate={270} y={380} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <Celular largura={w * 0.86} style={{ left: LARG / 2 - 640 - 120 * (1 - lados), top: topo + 60, opacity: lados, transform: `rotateY(28deg) scale(.95)` }}>
          <Img src={cap("cel-menu.jpg")} style={{ width: "100%" }} />
        </Celular>
        <Celular largura={w * 0.86} style={{ left: LARG / 2 + 330 + 120 * (1 - lados), top: topo + 60, opacity: lados, transform: `rotateY(-28deg) scale(.95)` }}>
          <Img src={cap("cel-lightbox.jpg")} style={{ width: "100%" }} />
        </Celular>
        <Celular largura={w} style={{ left: LARG / 2 - (w + 28 * k) / 2, top: topo + 120 * (1 - meio), opacity: meio, transform: `rotateY(${Math.sin(f / 50) * 4}deg)` }}>
          <Img src={cap("cel-pagina.jpg")} style={{ position: "absolute", left: 0, top: -y * k, width: w }} />
        </Celular>
      </AbsoluteFill>
      <Audio src={sfx("whoosh2")} volume={0.45} />
      <Sequence from={30} durationInFrames={30}><Audio src={sfx("whoosh")} volume={0.4} /></Sequence>
      {CEL_PARADAS.filter((_, i) => i % 2 === 0 && i > 1).map(([q]) => (
        <Sequence key={q} from={q - 40} durationInFrames={25}><Audio src={sfx("whoosh-curto")} volume={0.3} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};

// 6. Computador e celular lado a lado
const Juntos: React.FC = () => {
  const f = useCurrentFrame();
  const pc = spring({ frame: f, fps: FPS, config: { damping: 18 } });
  const cel = spring({ frame: f - 8, fps: FPS, config: { damping: 16 } });
  const L = 1180;
  const A = L * 900 / 1440;
  const deriva = interpolate(f, [0, 105], [0, -30]);
  return (
    <AbsoluteFill>
      <Fundo />
      <Navegador largura={L} altura={A} style={{ left: 150 + deriva, top: 130, opacity: pc, transform: `translateX(${(1 - pc) * -200}px)` }}>
        <Img src={cap("pc-hero.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Navegador>
      <Celular largura={330} style={{ left: 1430 - deriva, top: 150, opacity: cel, transform: `translateX(${(1 - cel) * 200}px)` }}>
        <Img src={cap("cel-hero.jpg")} style={{ width: "100%" }} />
      </Celular>
      <div style={{ position: "absolute", left: 150, top: 130 + A + 52 + 40, display: "flex", gap: 18, alignItems: "center", opacity: interpolate(f, [18, 30], [0, 1], clamp) }}>
        {["Computador", "Tablet", "Celular"].map((t, i) => (
          <div key={t} style={{ ...TEXTO, fontSize: 26, fontWeight: 600, color: C.osso, padding: "10px 24px", borderRadius: 30, border: `1.5px solid rgba(255,122,181,${i === 1 ? 0.3 : 0.6})`,
            opacity: spring({ frame: f - 18 - i * 5, fps: FPS }) }}>{t}</div>
        ))}
      </div>
      <Audio src={sfx("whoosh2")} volume={0.45} />
    </AbsoluteFill>
  );
};

// 7. Fechamento
const Fim: React.FC = () => {
  const f = useCurrentFrame();
  const a = spring({ frame: f - 4, fps: FPS, config: { damping: 14 } });
  const b = spring({ frame: f - 18, fps: FPS, config: { damping: 16 } });
  const c = spring({ frame: f - 32, fps: FPS, config: { damping: 16 } });
  const sai = interpolate(f, [120, 135], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: sai }}>
      <Fundo brilho={1.3} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ ...TITULO, fontSize: 132, lineHeight: 0.95, textAlign: "center", letterSpacing: -2, opacity: a, transform: `scale(${1.25 - 0.25 * a})`, filter: `blur(${(1 - a) * 12}px)` }}>
          Bianca<br />Dammenhain
        </div>
        <div style={{ ...TITULO, fontWeight: 700, fontStretch: "112%", fontSize: 40, color: C.rosa, marginTop: 34, opacity: b, transform: `translateY(${(1 - b) * 20}px)` }}>
          Tatuagem de glitter e coberturas
        </div>
        <div style={{ marginTop: 60, padding: "18px 40px", borderRadius: 40, background: "rgba(26,20,28,.9)", boxShadow: `0 0 0 1.5px ${C.rosa}, 0 0 50px rgba(255,122,181,.35)`,
          ...TEXTO, fontSize: 38, fontWeight: 600, color: C.osso, opacity: c, transform: `scale(${0.85 + 0.15 * c})` }}>{URL_SITE}</div>
      </AbsoluteFill>
      <Clarao em={0} dur={14} />
      <Audio src={sfx("impacto")} volume={0.85} />
      <Sequence from={16}><Audio src={sfx("brilho")} volume={0.6} /></Sequence>
    </AbsoluteFill>
  );
};

const CENAS: [number, number, React.FC][] = [
  [T.intro, T.hero, Intro], [T.hero, T.rola, Hero], [T.rola, T.galeria, Rola], [T.galeria, T.celular, Galeria],
  [T.celular, T.juntos, CelularCena], [T.juntos, T.fim, Juntos], [T.fim, DURACAO, Fim],
];

export const SiteBianca: React.FC = () => (
  <AbsoluteFill style={{ background: C.tinta }}>
    <Sequence from={T.hero - 6}>
      <Audio src={sfx("trilha")} volume={(f) => interpolate(f, [0, 20, DURACAO - T.hero - 60, DURACAO - T.hero], [0, 0.55, 0.55, 0], clamp)} />
    </Sequence>
    {CENAS.map(([de, ate, Cena]) => (
      <Sequence key={de} from={de} durationInFrames={ate - de}><Cena /></Sequence>
    ))}
  </AbsoluteFill>
);
