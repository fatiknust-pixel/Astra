// Gera src/videos.ts a partir das pastas conteudo/<id>/ que têm roteiro.json + imagens.json,
// e cria os arquivos gerados vazios que ainda faltam (para o projeto compilar antes do áudio).
// Uso: node scripts/registrar-videos.mjs
import fs from "node:fs";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const NOMES = { lula: "Lula", bolsonaro: "Bolsonaro" }; // ids de composição já usados

const ids = fs
  .readdirSync(path.join(RAIZ, "conteudo"))
  .filter((d) => fs.existsSync(path.join(RAIZ, "conteudo", d, "roteiro.json")) && fs.existsSync(path.join(RAIZ, "conteudo", d, "imagens.json")))
  .sort();

const imports = [];
const entradas = [];
ids.forEach((id, i) => {
  const gerado = path.join(RAIZ, "src/gerado", id);
  fs.mkdirSync(gerado, { recursive: true });
  if (!fs.existsSync(path.join(gerado, "narracao.json"))) fs.writeFileSync(path.join(gerado, "narracao.json"), '{"cenas":{}}\n');
  if (!fs.existsSync(path.join(gerado, "imagens.json"))) fs.writeFileSync(path.join(gerado, "imagens.json"), "{}\n");
  imports.push(
    `import r${i} from "../conteudo/${id}/roteiro.json";`,
    `import n${i} from "./gerado/${id}/narracao.json";`,
    `import m${i} from "./gerado/${id}/imagens.json";`
  );
  entradas.push(`  ${JSON.stringify(NOMES[id] ?? id)}: montarVideo(${JSON.stringify(id)}, r${i}, n${i}, m${i} as any),`);
});

fs.writeFileSync(
  path.join(RAIZ, "src/videos.ts"),
  `// ARQUIVO GERADO por scripts/registrar-videos.mjs — não edite à mão.
// Cada pasta conteudo/<id>/ com roteiro.json e imagens.json vira uma composição do Remotion.
import { montarVideo, VideoDados } from "./dados";
${imports.join("\n")}

export const VIDEOS: Record<string, VideoDados> = {
${entradas.join("\n")}
};
`
);
console.log("Vídeos registrados:", ids.map((id) => NOMES[id] ?? id).join(", "));
