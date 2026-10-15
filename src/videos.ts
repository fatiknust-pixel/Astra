// ARQUIVO GERADO por scripts/registrar-videos.mjs — não edite à mão.
// Cada pasta conteudo/<id>/ com roteiro.json e imagens.json vira uma composição do Remotion.
import { montarVideo, VideoDados } from "./dados";
import r0 from "../conteudo/bolsonaro/roteiro.json";
import n0 from "./gerado/bolsonaro/narracao.json";
import m0 from "./gerado/bolsonaro/imagens.json";
import r1 from "../conteudo/issue-2/roteiro.json";
import n1 from "./gerado/issue-2/narracao.json";
import m1 from "./gerado/issue-2/imagens.json";
import r2 from "../conteudo/issue-3/roteiro.json";
import n2 from "./gerado/issue-3/narracao.json";
import m2 from "./gerado/issue-3/imagens.json";
import r3 from "../conteudo/lula/roteiro.json";
import n3 from "./gerado/lula/narracao.json";
import m3 from "./gerado/lula/imagens.json";

export const VIDEOS: Record<string, VideoDados> = {
  "Bolsonaro": montarVideo("bolsonaro", r0, n0, m0 as any),
  "issue-2": montarVideo("issue-2", r1, n1, m1 as any),
  "issue-3": montarVideo("issue-3", r2, n2, m2 as any),
  "Lula": montarVideo("lula", r3, n3, m3 as any),
};
