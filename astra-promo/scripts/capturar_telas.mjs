// Captura as telas do app ASTRA (rodando em http://localhost) para usar no vídeo.
// Uso: node scripts/capturar_telas.mjs http://localhost:8765
// O logo da empresa é bloqueado de propósito: o vídeo não mostra marcas de terceiros.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const BASE = process.argv[2] || "http://localhost:8765";
const PASTA = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "telas");
const EXE = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium";

// Histórico fictício com três pessoas, para a tela de histórico ficar cheia
const agora = new Date(); agora.setHours(14, 2, 0, 0);
const t = (min) => agora.getTime() + min * 60000;
const LOG = [
  { ts: t(0), u: "elisangela", n: 7, campo: "Situação", de: "Não encontrada", para: "Encontrada" },
  { ts: t(1), u: "elisangela", n: 7, campo: "Torque", de: "9 Nm", para: "9,5 Nm" },
  { ts: t(3), u: "adeilson", n: 4, campo: "Posto", de: "5", para: "6" },
  { ts: t(6), u: "adeilson", n: 2, campo: "Situação", de: "Não encontrada", para: "Encontrada" },
  { ts: t(8), u: "admin", n: 9, campo: "Nº de série", de: "SN-2023-0761", para: "SN-2023-0762" },
];

const b = await chromium.launch({ executablePath: EXE, args: ["--lang=pt-BR"], env: { ...process.env, LANG: "pt_BR.UTF-8", LANGUAGE: "pt_BR:pt" } });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, colorScheme: "light", locale: "pt-BR", serviceWorkers: "block" });
await ctx.route(/logo\.(png|svg)$/, (r) => r.abort());
const p = await ctx.newPage();
// Guarda também a posição de alguns elementos (em px CSS), para o vídeo destacar o lugar certo
const MARCAS = {};
const foto = async (nome, full = false, seletores = []) => {
  await p.waitForTimeout(450);
  await p.screenshot({ path: path.join(PASTA, nome + ".png"), fullPage: full });
  const alt = await p.evaluate(() => document.documentElement.scrollHeight);
  MARCAS[nome] = { largura: 390, altura: full ? alt : 844, el: {} };
  for (const sel of seletores) {
    MARCAS[nome].el[sel] = await p.$$eval(sel, (els) => els.map((e) => {
      const r = e.getBoundingClientRect();
      return [Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)];
    }));
  }
  console.log("✓", nome);
};
const tocar = async (sel) => { await p.click(sel); await p.waitForTimeout(250); };

await p.goto(BASE);
await p.evaluate(() => localStorage.clear());
await p.reload();
await foto("login");
await p.fill("#lu", "elisangela"); await p.fill("#lp", "1234"); await tocar("[data-act=login]");
await foto("escanear", false, ["[data-act=cam]", "#manual"]);
await tocar("[data-go=tabs]"); await foto("tabelas", true);
await tocar('[data-arg="posto-14"]'); await foto("tabela-posto-14", true, [".ptab tbody tr", ".thead"]);
await tocar('[data-go=qr]'); await tocar('[data-arg="MAQ:7"]'); await tocar("[data-act=sim]");
await foto("maquina-7", false, [".plate", ".plate dd", "[data-act=unlock]"]);
await tocar("[data-act=unlock]"); await foto("senha", false, ["#pw", "[data-act=pwok]"]);
await p.fill("#pw", "1234"); await tocar("[data-act=pwok]");
await foto("formulario", true, ["#f-torque", "#f-status", "[data-act=savem]"]);
// salva uma alteração de verdade (o app só grava no aparelho depois da primeira mudança)
await p.fill("#f-torque", "9,5"); await p.selectOption("#f-status", "encontrada"); await tocar("[data-act=savem]");
// troca o histórico pelo fictício e o estado da máquina 7 depois das alterações
await p.evaluate((log) => {
  const d = JSON.parse(localStorage.getItem("inventario-torques-v3"));
  d.log = log;
  for (const m of d.machines) {
    if (m.n === 7) { m.status = "encontrada"; m.torque = 9.5; }
    if (m.n === 4) m.posto = 6;
    if (m.n === 2) m.status = "encontrada";
    if (m.n === 9) m.serie = "SN-2023-0762";
  }
  localStorage.setItem("inventario-torques-v3", JSON.stringify(d));
}, LOG);
await p.reload(); // recarrega para o app ler o banco atualizado
await p.fill("#lu", "elisangela"); await p.fill("#lp", "1234"); await tocar("[data-act=login]");
await tocar("[data-go=qr]"); await tocar('[data-arg="MAQ:7"]'); await tocar("[data-act=sim]");
await foto("maquina-7-encontrada", false, [".plate", ".plate dd"]);
await tocar("[data-go=log]"); await foto("historico", true, [".win", ".win p", ".sess"]);
await tocar("[data-go=inv]"); await foto("maquinas", true, [".stat", ".item"]);
await tocar("[data-go=qr]"); await tocar('[data-arg="TAB:posto-14"]'); await foto("qr-posto-14");
// versão de computador (janela larga)
const pc = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5, colorScheme: "light", locale: "pt-BR", serviceWorkers: "block" });
await pc.route(/logo\.(png|svg)$/, (r) => r.abort());
const q = await pc.newPage();
await q.goto(BASE);
await q.fill("#lu", "adeilson"); await q.fill("#lp", "4321"); await q.click("[data-act=login]");
await q.click("[data-go=tabs]"); await q.click('[data-arg="posto-pm4"]'); await q.waitForTimeout(450);
await q.screenshot({ path: path.join(PASTA, "pc-tabela.png") });
console.log("✓ pc-tabela");
await b.close();
fs.writeFileSync(path.join(PASTA, "marcas.json"), JSON.stringify(MARCAS, null, 1));
console.log("✓ marcas.json");
