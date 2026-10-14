// Junta roteiro + narração gerada + imagens baixadas numa linha do tempo em frames.
import { staticFile } from "remotion";
import roteiro from "../conteudo/roteiro.json";
import narracao from "./gerado/narracao.json";
import imagens from "./gerado/imagens.json";

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
const imgs = imagens as Record<string, ImagemInfo>;

export const arquivo = (p: string) => {
  const base = typeof window !== "undefined" ? (window as any).__BASE_ARQUIVOS__ : undefined;
  return base !== undefined ? base + p : staticFile(p);
};
export const imagem = (chave?: string) => (chave && imgs[chave] ? arquivo(imgs[chave].arquivo) : null);
export const creditoImagem = (chave?: string) => {
  const i = chave ? imgs[chave] : undefined;
  return i ? `${i.rotulo ?? chave} · Foto: ${i.autor} (${i.licenca}) via Wikimedia Commons` : null;
};
export const todosCreditos = () =>
  Object.values(imgs).map((i) => `${i.rotulo}: ${i.autor} — ${i.licenca}`);

export const normalizar = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ªº]/g, "");

const acharPalavra = (palavras: Palavra[], alvo: string | number | undefined) => {
  if (alvo === undefined) return 0;
  if (typeof alvo === "number") return palavras[alvo]?.ini ?? 0;
  const n = normalizar(alvo);
  const w = palavras.find((x) => normalizar(x.p) === n) ?? palavras.find((x) => normalizar(x.p).startsWith(n));
  if (!w) console.warn(`[roteiro] palavra-gatilho "${alvo}" não encontrada na narração`);
  return w ? Math.max(0, w.ini - 3) : 0;
};

const montar = (): CenaTempo[] => {
  let cursor = 0;
  return roteiro.cenas.map((c: any, indice: number) => {
    const n = (narracao as any).cenas?.[c.id];
    const durSeg = n ? n.duracao + FOLGA_FIM : Math.max(3, c.texto.split(/\s+/).length / 2.8);
    const duracao = Math.ceil(durSeg * FPS) + FOLGA_INICIO;
    const palavras: Palavra[] = (n?.palavras ?? []).map((w: any) => ({
      p: w.p,
      ini: Math.round(w.i * FPS) + FOLGA_INICIO,
      fim: Math.round(w.f * FPS) + FOLGA_INICIO,
    }));
    const base = (c.elementos as Elemento[]).map((e, i) => ({ ...e, indice: i, entra: acharPalavra(palavras, e.em), sai: duracao }));
    // um elemento sai quando outro (não-carimbo) ocupa a mesma posição
    for (const e of base) {
      const prox = base
        .filter((o) => o !== e && (o.posicao ?? "alto") === (e.posicao ?? "alto") && o.tipo !== "carimbo" && o.entra > e.entra)
        .sort((a, b) => a.entra - b.entra)[0];
      if (prox) e.sai = prox.entra;
    }
    const cena: CenaTempo = {
      id: c.id, indice, inicio: cursor, duracao, texto: c.texto,
      audio: n ? arquivo(n.audio) : undefined, fundo: c.fundo, fontes: c.fontes ?? [], palavras, elementos: base,
    };
    cursor += duracao;
    return cena;
  });
};

export const CENAS = montar();
export const DURACAO_TOTAL = CENAS.reduce((s, c) => s + c.duracao, 0);
export const LEGENDA = roteiro.legenda;
export const TITULO = roteiro.titulo;
