// Baixa as fotos das pessoas e dos locais citados (Wikipédia / Wikimedia Commons),
// salva em public/<video>/imagens/<chave>.jpg e registra autor + licença em src/gerado/<video>/imagens.json.
// Uso: node scripts/baixar-imagens.mjs [--forcar] [--video=<id>] [chave ...]   (padrão: todos os vídeos)
import fs from "node:fs";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const UA = "video-lula-condenacoes/1.0 (https://github.com/fatiknust-pixel/Astra)";

const args = process.argv.slice(2);
const forcar = args.includes("--forcar");
const so = args.filter((a) => !a.startsWith("--"));
const soVideo = args.find((a) => a.startsWith("--video="))?.slice(8);

const api = async (host, params) => {
  const url = `https://${host}/w/api.php?` + new URLSearchParams({ format: "json", formatversion: "2", origin: "*", ...params });
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`${host} respondeu ${r.status}`);
  return r.json();
};

const limparHtml = (s = "") => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

async function infoArquivo(titulo) {
  const j = await api("commons.wikimedia.org", {
    action: "query", titles: titulo.startsWith("File:") ? titulo : `File:${titulo}`,
    prop: "imageinfo", iiprop: "url|extmetadata|mime", iiurlwidth: "1080",
  });
  const p = j.query?.pages?.[0];
  const ii = p?.imageinfo?.[0];
  if (!ii || !/image\/(jpeg|png|webp)/.test(ii.mime)) return null;
  const m = ii.extmetadata || {};
  return {
    titulo: p.title,
    url: ii.thumburl || ii.url,
    pagina: ii.descriptionurl,
    autor: limparHtml(m.Artist?.value) || "Desconhecido",
    licenca: limparHtml(m.LicenseShortName?.value) || "ver página",
  };
}

async function viaWiki(artigo) {
  const j = await api("pt.wikipedia.org", { action: "query", titles: artigo, prop: "pageimages", piprop: "name", redirects: "1" });
  const nome = j.query?.pages?.[0]?.pageimage;
  return nome ? infoArquivo(nome) : null;
}

async function viaCommons(busca) {
  const j = await api("commons.wikimedia.org", {
    action: "query", list: "search", srsearch: `${busca} filetype:bitmap`, srnamespace: "6", srlimit: "8",
  });
  for (const r of j.query?.search || []) {
    const info = await infoArquivo(r.title);
    if (info) return info;
  }
  return null;
}

const videos = fs.readdirSync(path.join(RAIZ, "conteudo")).filter((d) => fs.existsSync(path.join(RAIZ, "conteudo", d, "imagens.json")) && (!soVideo || d === soVideo));
for (const video of videos) {
  console.log(`— ${video}`);
  const CONFIG = JSON.parse(fs.readFileSync(path.join(RAIZ, "conteudo", video, "imagens.json"), "utf8"));
  const PASTA = path.join(RAIZ, "public", video, "imagens");
  const SAIDA = path.join(RAIZ, "src/gerado", video, "imagens.json");
  const existente = fs.existsSync(SAIDA) ? JSON.parse(fs.readFileSync(SAIDA, "utf8")) : {};
  fs.mkdirSync(PASTA, { recursive: true });
  
  for (const [chave, cfg] of Object.entries(CONFIG)) {
    if (chave.startsWith("_") || (so.length && !so.includes(chave))) continue;
    const destino = path.join(PASTA, `${chave}.jpg`);
    if (!forcar && fs.existsSync(destino) && existente[chave]) { console.log(`= ${chave} (já existe)`); continue; }
  
    let info = null;
    try {
      if (cfg.arquivo) info = await infoArquivo(cfg.arquivo);
      for (const metodo of Object.keys(cfg)) {
        if (info) break;
        if (metodo === "wiki") info = await viaWiki(cfg.wiki);
        if (metodo === "commons") info = await viaCommons(cfg.commons);
      }
      if (!info) { console.warn(`! ${chave}: nenhuma imagem encontrada (o vídeo usa um gráfico no lugar)`); continue; }
      const r = await fetch(info.url, { headers: { "User-Agent": UA } });
      if (!r.ok) throw new Error(`download ${r.status}`);
      fs.writeFileSync(destino, Buffer.from(await r.arrayBuffer()));
      existente[chave] = { arquivo: `imagens/${chave}.jpg`, rotulo: cfg.rotulo, ...info };
      console.log(`✓ ${chave} ← ${info.titulo} (${info.licenca}, ${info.autor})`);
    } catch (e) {
      console.warn(`! ${chave}: ${e.message}`);
    }
  }
  
  fs.mkdirSync(path.dirname(SAIDA), { recursive: true });
  fs.writeFileSync(SAIDA, JSON.stringify(existente, null, 2) + "\n");
}
