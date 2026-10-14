// Gera a apresentação do Projeto 5S (PowerPoint) a partir de conteudo/5s/casos.json.
// Uso: npm run pptx  ->  out/Projeto-5S.pptx
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa6");

const RAIZ = path.join(__dirname, "..");
const DADOS = JSON.parse(fs.readFileSync(path.join(RAIZ, "conteudo/5s/casos.json"), "utf8"));
const FOTO = (id) => path.join(RAIZ, "public/5s/fotos", id + ".jpg");
const SAIDA = path.join(RAIZ, "out/Projeto-5S.pptx");

const THEME = {
  name: "Projeto 5S",
  headFontFace: "Arial",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "18222D", lt1: "FFFFFF", dk2: "4A5866", lt2: "F1F3F5",
    accent1: "F5C400", accent2: "C2410C", accent3: "1F5FA8",
    accent4: "15803D", accent5: "7A8794", accent6: "2B3642",
    hlink: "1F5FA8", folHlink: "4A5866",
  },
};
const HEX = THEME.colors;

async function icone(Comp, cor, tam = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + cor, size: tam }));
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + png.toString("base64");
}

// pptxgenjs grava a paleta padrão do Office; aqui gravamos as cores do projeto no tema do arquivo.
async function aplicarTema(arquivo, tema) {
  const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
  const zip = await JSZip.loadAsync(fs.readFileSync(arquivo));
  for (const nome of Object.keys(zip.files).filter((n) => /^ppt\/theme\/theme\d+\.xml$/.test(n))) {
    let xml = await zip.file(nome).async("string");
    for (const [k, v] of Object.entries(tema.colors)) {
      xml = xml.replace(new RegExp(`<a:${k}>[\\s\\S]*?</a:${k}>`), `<a:${k}><a:srgbClr val="${v}"/></a:${k}>`);
    }
    xml = xml.replace(/<a:clrScheme name="[^"]*"/, `<a:clrScheme name="${tema.name}"`);
    zip.file(nome, xml);
  }
  fs.writeFileSync(arquivo, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.title = "Projeto 5S";
  pres.author = DADOS.projeto.equipe;
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const W = 13.333;

  // ---------- Layouts ----------
  const rodape = (escuro) => [
    { text: { text: "PROJETO 5S  ·  LINHA DE MONTAGEM", options: { x: 0.6, y: 6.98, w: 6, h: 0.3, fontSize: 10, bold: true, charSpacing: 2, color: escuro ? C.background2 : C.text2, margin: 0 } } },
  ];
  const numPag = (escuro) => ({ x: 12.23, y: 6.98, w: 0.5, h: 0.3, fontSize: 10, color: escuro ? C.background2 : C.text2, align: "right" });

  pres.defineSlideMaster({
    title: "CAPA",
    background: { color: HEX.dk1 },
    objects: [],
  });
  pres.defineSlideMaster({
    title: "CONTEUDO",
    background: { color: HEX.lt1 },
    margin: [0.5, 0.6, 0.6, 0.6],
    objects: [
      ...rodape(false),
      { placeholder: { options: { name: "kicker", type: "body", x: 0.6, y: 0.38, w: 9, h: 0.35, fontSize: 12, bold: true, charSpacing: 3, color: C.text2, margin: 0 }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.7, w: 12.1, h: 0.75, fontSize: 32, bold: true, color: C.text1, fontFace: THEME.headFontFace, margin: 0, valign: "top", align: "left" }, text: "" } },
    ],
    slideNumber: numPag(false),
  });
  pres.defineSlideMaster({
    title: "DESTAQUE",
    background: { color: HEX.dk1 },
    objects: [
      ...rodape(true),
      { placeholder: { options: { name: "kicker", type: "body", x: 0.6, y: 0.38, w: 9, h: 0.35, fontSize: 12, bold: true, charSpacing: 3, color: C.accent1, margin: 0 }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.7, w: 12.1, h: 0.75, fontSize: 32, bold: true, color: C.background1, fontFace: THEME.headFontFace, margin: 0, valign: "top", align: "left" }, text: "" } },
    ],
    slideNumber: numPag(true),
  });

  // ---------- Helpers ----------
  const foto = (s, id, x, y, w, h, nome) => {
    s.addImage({ path: FOTO(id), x, y, w, h, sizing: { type: "cover", w, h }, objectName: nome || "Foto " + id, altText: "Foto do posto " + id,
      shadow: { type: "outer", color: "000000", opacity: 0.25, blur: 8, offset: 3, angle: 90 } });
  };
  const etiqueta = (s, texto, x, y, cor, corTexto) => {
    const w = 0.25 + texto.length * 0.13;
    s.addText(texto, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06, x, y, w, h: 0.4, fill: { color: cor }, color: corTexto || C.background1,
      fontSize: 13, bold: true, charSpacing: 2, align: "center", valign: "middle", margin: 0, objectName: "Etiqueta " + texto });
  };
  const chips = (s, lista, x, y) => {
    let cx = x;
    for (const n of lista) {
      const w = 0.3 + n.length * 0.11;
      s.addText(n, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.15, x: cx, y, w, h: 0.32, fill: { color: C.accent1 }, color: C.text1,
        fontSize: 11, bold: true, align: "center", valign: "middle", margin: 0, objectName: "Senso " + n });
      cx += w + 0.12;
    }
  };
  const seta = async (s, x, y, d = 0.62) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: C.accent1 }, line: { color: C.background1, width: 3 }, objectName: "Seta fundo" });
    s.addImage({ data: await icone(fa.FaArrowRight, HEX.dk1), x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5, objectName: "Seta" });
  };
  const textoCaso = (s, c, x, y, w) => {
    s.addText([
      { text: "PROBLEMA", options: { fontSize: 11, bold: true, charSpacing: 2, color: C.accent2, breakLine: true } },
      { text: c.problema, options: { fontSize: 15, color: C.text1, breakLine: true } },
    ], { x, y, w, h: 0.95, valign: "top", margin: 0, paraSpaceAfter: 3, isTextBox: true, objectName: "Problema" });
  };
  const textoAcao = (s, c, x, y, w) => {
    s.addText([
      { text: "AÇÃO 5S", options: { fontSize: 11, bold: true, charSpacing: 2, color: C.accent3, breakLine: true } },
      { text: c.acao, options: { fontSize: 15, color: C.text1, breakLine: true } },
    ], { x, y, w, h: 0.95, valign: "top", margin: 0, paraSpaceAfter: 3, isTextBox: true, objectName: "Ação" });
  };

  const casos = DADOS.casos;
  const feitos = casos.filter((c) => c.status === "concluido");
  const pendentes = casos.filter((c) => c.status === "pendente");
  const nFotos = fs.readdirSync(path.join(RAIZ, "public/5s/fotos")).filter((f) => f.endsWith(".jpg")).length;

  // ---------- 1. Capa ----------
  pres.addSection({ title: "Abertura" });
  {
    const s = pres.addSlide({ masterName: "CAPA", sectionTitle: "Abertura" });
    s.addImage({ path: FOTO("f0048"), x: 6.2, y: 0, w: W - 6.2, h: 7.5, sizing: { type: "cover", w: W - 6.2, h: 7.5 }, objectName: "Foto capa" });
    s.addShape(pres.shapes.RECTANGLE, { x: 6.2, y: 0, w: W - 6.2, h: 7.5, fill: { color: C.text1, transparency: 55 }, line: { type: "none" }, objectName: "Véu" });
    s.addText("5S", { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.1, x: 0.7, y: 0.8, w: 1.5, h: 1.0, fill: { color: C.accent1 }, color: C.text1,
      fontSize: 40, bold: true, align: "center", valign: "middle", margin: 0, fontFace: THEME.headFontFace, objectName: "Selo 5S" });
    s.addText("PROJETO 5S", { x: 0.7, y: 2.3, w: 5.4, h: 1.0, fontSize: 54, bold: true, color: C.background1, fontFace: THEME.headFontFace, margin: 0, isTextBox: true, objectName: "Título" });
    s.addText(DADOS.projeto.subtitulo, { x: 0.7, y: 3.35, w: 5.2, h: 1.1, fontSize: 22, color: C.background2, margin: 0, valign: "top", isTextBox: true, objectName: "Subtítulo" });
    s.addText([
      { text: "EQUIPE", options: { fontSize: 11, bold: true, charSpacing: 3, color: C.accent1, breakLine: true } },
      { text: DADOS.projeto.equipe, options: { fontSize: 16, color: C.background1, breakLine: true } },
      { text: DADOS.projeto.data, options: { fontSize: 14, color: C.background2 } },
    ], { x: 0.7, y: 5.4, w: 5.2, h: 1.2, margin: 0, valign: "bottom", paraSpaceAfter: 4, isTextBox: true, objectName: "Equipe" });
    s.addNotes("Abertura: apresentar o projeto 5S, a equipe e o objetivo de deixar os postos mais organizados, limpos e seguros.");
  }

  // ---------- 2. Os 5 sensos ----------
  pres.addSection({ title: "Metodologia" });
  {
    const s = pres.addSlide({ masterName: "CONTEUDO", sectionTitle: "Metodologia" });
    s.addText("METODOLOGIA", { placeholder: "kicker" });
    s.addText("Os 5 sensos que guiaram cada melhoria", { placeholder: "title" });
    const icones = [fa.FaFilter, fa.FaTableCellsLarge, fa.FaBroom, fa.FaClipboardCheck, fa.FaPeopleGroup];
    const cw = 2.26, gap = 0.2, y = 1.85, h = 4.6;
    for (let i = 0; i < 5; i++) {
      const sn = DADOS.sensos[i], x = 0.6 + i * (cw + gap);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h, rectRadius: 0.08, fill: { color: C.background2 }, line: { type: "none" }, objectName: "Card " + sn.jp });
      s.addText(String(i + 1), { x: x + 0.25, y: y + 0.25, w: 0.9, h: 0.9, fontSize: 44, bold: true, color: C.text1, fontFace: THEME.headFontFace, margin: 0, isTextBox: true, objectName: "Número " + (i + 1) });
      s.addShape(pres.shapes.OVAL, { x: x + cw - 0.95, y: y + 0.3, w: 0.7, h: 0.7, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Círculo ícone" });
      s.addImage({ data: await icone(icones[i], HEX.dk1), x: x + cw - 0.8, y: y + 0.45, w: 0.4, h: 0.4, objectName: "Ícone " + sn.jp });
      s.addText([
        { text: sn.jp.toUpperCase(), options: { fontSize: 12, bold: true, charSpacing: 2, color: C.text2, breakLine: true } },
        { text: sn.pt, options: { fontSize: 18, bold: true, color: C.text1, fontFace: THEME.headFontFace, breakLine: true } },
      ], { x: x + 0.25, y: y + 1.45, w: cw - 0.5, h: 0.95, margin: 0, valign: "top", paraSpaceAfter: 2, isTextBox: true, objectName: "Nome " + sn.jp });
      s.addText(sn.frase, { x: x + 0.25, y: y + 2.5, w: cw - 0.5, h: 1.6, fontSize: 15, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "Frase " + sn.jp });
    }
    s.addNotes("Explicar rapidamente cada senso. Em cada caso a seguir, as etiquetas amarelas mostram quais sensos foram aplicados.");
  }

  // ---------- 3. Resultados em números ----------
  pres.addSection({ title: "Resultados" });
  {
    const s = pres.addSlide({ masterName: "CONTEUDO", sectionTitle: "Resultados" });
    s.addText("RESULTADOS", { placeholder: "kicker" });
    s.addText("O projeto em números", { placeholder: "title" });
    const stats = [
      { n: String(casos.length), t: "áreas trabalhadas", cor: C.text1 },
      { n: String(feitos.length), t: "melhorias com antes e depois", cor: C.accent3 },
      { n: String(pendentes.length), t: "áreas com foto do depois pendente", cor: C.accent2 },
      { n: String(nFotos), t: "registros fotográficos", cor: C.text1 },
    ];
    stats.forEach((st, i) => {
      const x = 0.6 + (i % 2) * 3.55, y = 1.85 + Math.floor(i / 2) * 2.4;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 3.35, h: 2.2, rectRadius: 0.08, fill: { color: C.background2 }, line: { type: "none" }, objectName: "Stat " + i });
      s.addText(st.n, { x: x + 0.3, y: y + 0.2, w: 2.8, h: 1.1, fontSize: 64, bold: true, color: st.cor, fontFace: THEME.headFontFace, margin: 0, isTextBox: true, objectName: "Número stat " + i });
      s.addText(st.t, { x: x + 0.3, y: y + 1.35, w: 2.8, h: 0.7, fontSize: 16, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "Rótulo stat " + i });
    });
    s.addChart(pres.charts.DOUGHNUT, [{ name: "Status", labels: ["Concluídas", "Depois pendente"], values: [feitos.length, pendentes.length] }], {
      x: 8.0, y: 1.75, w: 4.7, h: 4.85, holeSize: 62, chartColors: [HEX.accent3, HEX.accent2],
      showTitle: true, title: "Status das áreas", titleFontSize: 16, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
      showLegend: true, legendPos: "b", legendFontSize: 14, legendColor: HEX.dk1, legendFontFace: "+mn-lt",
      showValue: true, showPercent: false, dataLabelColor: HEX.lt1, dataLabelFontSize: 16, dataLabelFontBold: true, dataLabelFontFace: "+mn-lt",
      objectName: "Gráfico status",
    });
    s.addNotes("Resumo: 9 áreas trabalhadas, 5 já com foto de antes e depois e 4 aguardando o registro do depois.");
  }

  // ---------- 4. Mapa das áreas ----------
  {
    const s = pres.addSlide({ masterName: "CONTEUDO", sectionTitle: "Resultados" });
    s.addText("ONDE ATUAMOS", { placeholder: "kicker" });
    s.addText("Nove áreas da linha passaram pelo 5S", { placeholder: "title" });
    const cols = 3, tw = 3.95, th = 1.55, gx = 0.13, gy = 0.17;
    casos.forEach((c, i) => {
      const x = 0.6 + (i % cols) * (tw + gx), y = 1.75 + Math.floor(i / cols) * (th + gy);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: tw, h: th, rectRadius: 0.06, fill: { color: C.background2 }, line: { type: "none" }, objectName: "Área " + c.curto });
      const fid = (c.depois && c.depois[0]) || c.antes[0];
      s.addImage({ path: FOTO(fid), x: x + 0.12, y: y + 0.12, w: 1.6, h: th - 0.24, sizing: { type: "cover", w: 1.6, h: th - 0.24 }, objectName: "Miniatura " + c.curto });
      s.addText(String(i + 1).padStart(2, "0"), { x: x + 1.9, y: y + 0.14, w: 0.6, h: 0.35, fontSize: 13, bold: true, color: C.text2, margin: 0, isTextBox: true, objectName: "Num área" });
      s.addText(c.titulo, { x: x + 1.9, y: y + 0.42, w: tw - 2.05, h: 0.62, fontSize: 13, bold: true, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "Nome área" });
      const ok = c.status === "concluido";
      s.addText(ok ? "CONCLUÍDO" : "DEPOIS PENDENTE", { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.12, x: x + 1.9, y: y + th - 0.45, w: ok ? 1.2 : 1.7, h: 0.28,
        fill: { color: ok ? C.accent3 : C.accent2 }, color: C.background1, fontSize: 10, bold: true, charSpacing: 1, align: "center", valign: "middle", margin: 0, objectName: "Status área" });
    });
    s.addNotes("Visão geral das nove áreas. As cinco primeiras já estão concluídas, as quatro últimas aguardam a foto do depois.");
  }

  // ---------- 5..9. Casos concluídos ----------
  pres.addSection({ title: "Antes e depois" });
  for (const [idx, c] of feitos.entries()) {
    const s = pres.addSlide({ masterName: "CONTEUDO", sectionTitle: "Antes e depois" });
    s.addText(`CASO ${String(idx + 1).padStart(2, "0")}  ·  ANTES E DEPOIS`, { placeholder: "kicker" });
    s.addText(c.titulo, { placeholder: "title" });

    if (c.id === "estacao") {
      // Três retratos: antes · limpeza · depois
      const pw = 2.75, ph = 4.85, y = 1.7;
      const seq = [[c.antes[0], "ANTES", C.accent2], [c.durante[0], "LIMPEZA", C.text2], [c.depois[0], "DEPOIS", C.accent3]];
      seq.forEach(([fid, rot, cor], i) => {
        const x = 0.6 + i * (pw + 0.55);
        foto(s, fid, x, y, pw, ph, "Foto " + rot);
        etiqueta(s, rot, x + 0.15, y + 0.15, cor);
      });
      await seta(s, 0.6 + pw + 0.55 / 2 - 0.27, y + ph / 2 - 0.27, 0.54);
      await seta(s, 0.6 + 2 * pw + 0.55 + 0.55 / 2 - 0.27, y + ph / 2 - 0.27, 0.54);
      const tx = 0.6 + 3 * pw + 2 * 0.55 + 0.5;
      textoCaso(s, c, tx, 1.75, W - 0.6 - tx);
      s.addText([
        { text: "AÇÃO 5S", options: { fontSize: 11, bold: true, charSpacing: 2, color: C.accent3, breakLine: true } },
        { text: c.acao, options: { fontSize: 15, color: C.text1 } },
      ], { x: tx, y: 3.25, w: W - 0.6 - tx, h: 1.5, valign: "top", margin: 0, paraSpaceAfter: 3, isTextBox: true, objectName: "Ação" });
      s.addText("SENSOS APLICADOS", { x: tx, y: 4.95, w: 3, h: 0.3, fontSize: 11, bold: true, charSpacing: 2, color: C.text2, margin: 0, isTextBox: true, objectName: "Rótulo sensos" });
      chips(s, c.sensos, tx, 5.3);
    } else if (c.id === "armario") {
      // Dois retratos + texto à direita
      const pw = 2.9, ph = 4.9, y = 1.7;
      foto(s, c.antes[0], 0.6, y, pw, ph, "Foto antes");
      etiqueta(s, "ANTES", 0.75, y + 0.15, C.accent2);
      foto(s, c.depois[0], 0.6 + pw + 0.6, y, pw, ph, "Foto depois");
      etiqueta(s, "DEPOIS", 0.6 + pw + 0.75, y + 0.15, C.accent3);
      await seta(s, 0.6 + pw + 0.3 - 0.31, y + ph / 2 - 0.31);
      const tx = 0.6 + 2 * pw + 0.6 + 0.6, tw = W - 0.6 - tx;
      textoCaso(s, c, tx, 1.75, tw);
      textoAcao(s, c, tx, 3.05, tw);
      s.addText("SENSOS APLICADOS", { x: tx, y: 4.4, w: 3, h: 0.3, fontSize: 11, bold: true, charSpacing: 2, color: C.text2, margin: 0, isTextBox: true, objectName: "Rótulo sensos" });
      chips(s, c.sensos, tx, 4.75);
    } else {
      // Par de fotos grandes lado a lado
      const pw = 5.75, ph = 3.65, y = 1.65;
      const antes = c.id === "ferramentas" ? "f0047" : c.antes[0];
      foto(s, antes, 0.6, y, pw, ph, "Foto antes");
      etiqueta(s, "ANTES", 0.75, y + 0.15, C.accent2);
      foto(s, c.depois[0], W - 0.6 - pw, y, pw, ph, "Foto depois");
      etiqueta(s, "DEPOIS", W - 0.6 - pw + 0.15, y + 0.15, C.accent3);
      await seta(s, W / 2 - 0.31, y + ph / 2 - 0.31);
      textoCaso(s, c, 0.6, 5.5, 5.0);
      textoAcao(s, c, 5.85, 5.5, 4.6);
      s.addText("SENSOS", { x: 10.75, y: 5.5, w: 2, h: 0.3, fontSize: 11, bold: true, charSpacing: 2, color: C.text2, margin: 0, isTextBox: true, objectName: "Rótulo sensos" });
      chips(s, c.sensos, 10.75, 5.85);
    }
    s.addNotes(`${c.titulo}. Antes: ${c.problema} Depois: ${c.acao}`);
  }

  // ---------- 10. Pendentes ----------
  pres.addSection({ title: "Em andamento" });
  {
    const s = pres.addSlide({ masterName: "CONTEUDO", sectionTitle: "Em andamento" });
    s.addText("EM ANDAMENTO", { placeholder: "kicker" });
    s.addText("Áreas mapeadas aguardando o registro do depois", { placeholder: "title" });
    const pw = 2.85, gap = 0.233, y = 1.7, ph = 2.85;
    pendentes.forEach((c, i) => {
      const x = 0.6 + i * (pw + gap);
      foto(s, c.antes[0], x, y, pw, ph, "Foto " + c.curto);
      etiqueta(s, "ANTES", x + 0.12, y + 0.12, C.accent2);
      s.addText(c.titulo, { x, y: y + ph + 0.2, w: pw, h: 0.65, fontSize: 16, bold: true, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "Título " + c.curto });
      s.addText(c.problema, { x, y: y + ph + 0.85, w: pw, h: 0.8, fontSize: 14, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "Obs " + c.curto });
      s.addText("FOTO DO DEPOIS PENDENTE", { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.12, x, y: 6.35, w: pw, h: 0.34, fill: { color: C.background2 },
        line: { color: C.accent2, width: 1.25, dashType: "dash" }, color: C.accent2, fontSize: 11, bold: true, charSpacing: 1, align: "center", valign: "middle", margin: 0, objectName: "Pendente " + c.curto });
    });
    s.addNotes("Estas quatro áreas já foram mapeadas. Falta registrar a foto do depois para fechar o ciclo.");
  }

  // ---------- 11. Ganhos ----------
  pres.addSection({ title: "Conclusão" });
  {
    const s = pres.addSlide({ masterName: "CONTEUDO", sectionTitle: "Conclusão" });
    s.addText("GANHOS", { placeholder: "kicker" });
    s.addText("O que muda no dia a dia do posto", { placeholder: "title" });
    const ganhos = [
      [fa.FaPersonWalkingArrowRight, "Acesso livre às máquinas", "Carrinhos reposicionados: nada obstrui a máquina da suspensão."],
      [fa.FaScrewdriverWrench, "Cada ferramenta no seu lugar", "Armários e carrinhos com posição fixa para peças e ferramentas."],
      [fa.FaBroom, "Posto limpo e mais seguro", "Sem frascos tombados, fitas soltas ou bancadas sujas."],
      [fa.FaClipboardCheck, "Padrão visual para todos", "O mesmo arranjo em todos os turnos, fácil de conferir."],
    ];
    for (const [i, [Ic, t, d]] of ganhos.entries()) {
      const y = 1.8 + i * 1.22;
      s.addShape(pres.shapes.OVAL, { x: 0.6, y, w: 0.8, h: 0.8, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Círculo ganho " + i });
      s.addImage({ data: await icone(Ic, HEX.dk1), x: 0.8, y: y + 0.2, w: 0.4, h: 0.4, objectName: "Ícone ganho " + i });
      s.addText([
        { text: t, options: { fontSize: 18, bold: true, color: C.text1, breakLine: true } },
        { text: d, options: { fontSize: 15, color: C.text2 } },
      ], { x: 1.65, y: y - 0.05, w: 5.9, h: 1.0, margin: 0, valign: "top", paraSpaceAfter: 2, isTextBox: true, objectName: "Ganho " + i });
    }
    foto(s, "f0031", 7.95, 1.75, 4.78, 4.85, "Foto ganhos");
    etiqueta(s, "DEPOIS", 8.1, 1.9, C.accent3);
    s.addNotes("Os ganhos são de acesso, organização, limpeza e padrão — o que o operador sente no dia a dia.");
  }

  // ---------- 12. Próximos passos ----------
  {
    const s = pres.addSlide({ masterName: "CONTEUDO", sectionTitle: "Conclusão" });
    s.addText("PRÓXIMOS PASSOS", { placeholder: "kicker" });
    s.addText("Como manter e ampliar o resultado", { placeholder: "title" });
    const passos = [
      ["Registrar o depois", "Fotografar as 4 áreas pendentes para fechar o antes e depois."],
      ["Concluir as pendências", "Organizar cabos, carregadores, mangueiras e áreas demarcadas."],
      ["Auditar o padrão", "Checklist 5S periódico em cada posto, com dono definido."],
      ["Levar para outros postos", "Usar estes casos como referência para o resto da linha."],
    ];
    const cw = 2.85, gap = 0.233, y = 2.6;
    s.addShape(pres.shapes.LINE, { x: 0.6 + 0.4, y: y + 0.4, w: 3 * (cw + gap), h: 0, line: { color: C.accent5, width: 2, dashType: "dash" }, objectName: "Linha do tempo" });
    passos.forEach(([t, d], i) => {
      const x = 0.6 + i * (cw + gap);
      s.addText(String(i + 1), { shape: pres.shapes.OVAL, x, y, w: 0.8, h: 0.8, fill: { color: C.accent1 }, line: { color: C.background1, width: 3 }, color: C.text1,
        fontSize: 24, bold: true, align: "center", valign: "middle", margin: 0, objectName: "Passo " + (i + 1) });
      s.addText(t, { x, y: y + 1.1, w: cw - 0.1, h: 0.75, fontSize: 19, bold: true, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "Título passo " + (i + 1) });
      s.addText(d, { x, y: y + 1.9, w: cw - 0.2, h: 1.4, fontSize: 15, color: C.text2, margin: 0, valign: "top", isTextBox: true, objectName: "Texto passo " + (i + 1) });
    });
    s.addNotes("Próximos passos para sustentar o 5S: o quinto senso, disciplina, é o que garante que o resultado dure.");
  }

  // ---------- 13. Encerramento ----------
  {
    const s = pres.addSlide({ masterName: "CAPA", sectionTitle: "Conclusão" });
    s.addImage({ path: FOTO("f0036"), x: 0, y: 0, w: W, h: 7.5, sizing: { type: "cover", w: W, h: 7.5 }, objectName: "Foto fundo" });
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 7.5, fill: { color: C.text1, transparency: 22 }, line: { type: "none" }, objectName: "Véu" });
    s.addText("5S", { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.1, x: W / 2 - 0.75, y: 1.5, w: 1.5, h: 1.0, fill: { color: C.accent1 }, color: C.text1,
      fontSize: 40, bold: true, align: "center", valign: "middle", margin: 0, objectName: "Selo 5S" });
    s.addText("Posto organizado é posto seguro e produtivo", { x: 1.2, y: 2.85, w: W - 2.4, h: 1.5, fontSize: 40, bold: true, color: C.background1, align: "center", valign: "middle", fontFace: THEME.headFontFace, margin: 0, isTextBox: true, objectName: "Mensagem" });
    s.addText("Obrigado!", { x: 1.2, y: 4.5, w: W - 2.4, h: 0.7, fontSize: 26, color: C.accent1, bold: true, align: "center", margin: 0, isTextBox: true, objectName: "Obrigado" });
    s.addText(DADOS.projeto.equipe, { x: 1.2, y: 5.25, w: W - 2.4, h: 0.5, fontSize: 16, color: C.background2, align: "center", margin: 0, isTextBox: true, objectName: "Equipe" });
    s.addNotes("Encerramento e abertura para perguntas.");
  }

  fs.mkdirSync(path.dirname(SAIDA), { recursive: true });
  await pres.writeFile({ fileName: SAIDA });
  await aplicarTema(SAIDA, THEME);
  console.log("ok:", SAIDA);
}

main().catch((e) => { console.error(e); process.exit(1); });
