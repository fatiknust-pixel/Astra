// ARQUIVO GERADO por scripts/registrar-videos.mjs — não edite à mão.
// Cada pasta conteudo/<id>/ com roteiro.json e imagens.json vira uma composição do Remotion.
import { montarVideo, VideoDados } from "./dados";
import r0 from "../conteudo/bolsonaro/roteiro.json";
import n0 from "./gerado/bolsonaro/narracao.json";
import m0 from "./gerado/bolsonaro/imagens.json";
import r1 from "../conteudo/lula/roteiro.json";
import n1 from "./gerado/lula/narracao.json";
import m1 from "./gerado/lula/imagens.json";

export const VIDEOS: Record<string, VideoDados> = {
  "Bolsonaro": montarVideo("bolsonaro", r0, n0, m0 as any),
  "Lula": montarVideo("lula", r1, n1, m1 as any),
};
