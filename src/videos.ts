// Lista de vídeos do projeto. Para criar outro: copie conteudo/<id>/, gere áudio/imagens e registre aqui.
import { montarVideo, VideoDados } from "./dados";
import lulaRoteiro from "../conteudo/lula/roteiro.json";
import lulaNarracao from "./gerado/lula/narracao.json";
import lulaImagens from "./gerado/lula/imagens.json";
import bolsoRoteiro from "../conteudo/bolsonaro/roteiro.json";
import bolsoNarracao from "./gerado/bolsonaro/narracao.json";
import bolsoImagens from "./gerado/bolsonaro/imagens.json";

export const VIDEOS: Record<string, VideoDados> = {
  Lula: montarVideo("lula", lulaRoteiro, lulaNarracao, lulaImagens as any),
  Bolsonaro: montarVideo("bolsonaro", bolsoRoteiro, bolsoNarracao, bolsoImagens as any),
};
