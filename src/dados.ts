// Junta roteiro + narração gerada + imagens baixadas numa linha do tempo em frames.
// Cada vídeo mora em conteudo/<id>/ (roteiro e imagens), src/gerado/<id>/ e public/<id>/.
import { staticFile } from "remotion";
import { Tema, TEMAS } from "./temas";

export const FPS = 30;
export const LARGURA = 1080;
export const ALTURA = 1920;
const FOLGA_INICIO = 4; // frames antes da voz começar (entra a transição)
const FOLGA_FIM = 0.35; // segundos de respiro no fim de cada cena

export type Palavra = { p: string; ini: number; fim: number }; // frames relativos à cena
export type Elemento = { tipo: string; em?: string | number; posicao?: string; [k: string]: any };
export type ElementoTempo = Elemento & { entra: number; sai: number; indice: number };
export type CenaTempo = {
  id: string;
  indice: number;
  inicio: number;
  duracao: number;
  texto: string;
  audio?: string;
  fundo?: string;
  fontes: string[];
  palavras: Palavra[];
  elementos: ElementoTempo[];
};
type ImagemInfo = { arquivo: string; rotulo?: string; autor?: string; licenca?: string };

export type VideoDados = {
  id: string;
  titulo: string;
  cenas: CenaTempo[];
  duracao: number;
  legenda: { palavrasPorTela: number; corDestaque?: string };
  tema: Tema;
  imagem: (chave?: string) => string | null;
  creditoImagem: (chave?: string) => string | null;
  todosCreditos: () => string[];
};

export const arquivo = (p: string) => {
  const base = typeof window !== "undefined" ? (window as any).__BASE_ARQUIVOS__ : undefined;
  return base !== undefined ? base + p : staticFile(p);
};

export const normalizar = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ªº]/g, "");

const acharPalavra = (palavras: Palavra[], alvo: string | number | undefined, video: string) => {
  if (alvo === undefined) return 0;
  if (typeof alvo === "number") return palavras[alvo]?.ini ?? 0;
  const n = normalizar(alvo);
  const w =
    palavras.find((x) => normalizar(x.p) === n) ??
    palavras.find((x) => normalizar(x.p).startsWith(n)) ??
    palavras.find((x) => normalizar(x.p).includes(n));
  if (!w && palavras.length) console.warn(`[${video}] palavra-gatilho "${alvo}" não encontrada na narração`);
  return w ? Math.max(0, w.ini - 3) : 0;
};

export const montarVideo = (id: string, roteiro: any, narracao: any, imagens: Record<string, ImagemInfo>): VideoDados => {
  const imgs = imagens ?? {};
  let cursor = 0;
  const cenas: CenaTempo[] = roteiro.cenas.map((c: any, indice: number) => {
    const n = narracao?.cenas?.[c.id];
    const durSeg = n ? n.duracao + FOLGA_FIM : Math.max(3, c.texto.split(/\s+/).length / 2.8);
    const duracao = Math.ceil(durSeg * FPS) + FOLGA_INICIO;
    const palavras: Palavra[] = (n?.palavras ?? []).map((w: any) => ({
      p: w.p,
      ini: Math.round(w.i * FPS) + FOLGA_INICIO,
      fim: Math.round(w.f * FPS) + FOLGA_INICIO,
    }));
    const base = (c.elementos as Elemento[]).map((e, i) => ({ ...e, indice: i, entra: acharPalavra(palavras, e.em, id), sai: duracao }));
    // um elemento sai quando outro (não-carimbo) ocupa a mesma posição
    for (const e of base) {
      const prox = base
        .filter((o) => o !== e && (o.posicao ?? "alto") === (e.posicao ?? "alto") && o.tipo !== "carimbo" && o.entra > e.entra)
        .sort((a, b) => a.entra - b.entra)[0];
      if (prox) e.sai = prox.entra;
    }
    const cena: CenaTempo = {
      id: c.id, indice, inicio: cursor, duracao, texto: c.texto,
      audio: n ? arquivo(`${id}/${n.audio}`) : undefined, fundo: c.fundo, fontes: c.fontes ?? [], palavras, elementos: base,
    };
    cursor += duracao;
    return cena;
  });
  const tema = TEMAS[roteiro.tema ?? "padrao"] ?? TEMAS.padrao;
  return {
    id,
    titulo: roteiro.titulo,
    cenas,
    duracao: cursor,
    legenda: roteiro.legenda,
    tema,
    imagem: (chave) => (chave && imgs[chave] ? arquivo(`${id}/${imgs[chave].arquivo}`) : null),
    creditoImagem: (chave) => {
      const i = chave ? imgs[chave] : undefined;
      return i ? `${i.rotulo ?? chave} · Foto: ${i.autor} (${i.licenca}) via Wikimedia Commons` : null;
    },
    todosCreditos: () => Object.values(imgs).map((i) => `${i.rotulo}: ${i.autor} — ${i.licenca}`),
  };
};
