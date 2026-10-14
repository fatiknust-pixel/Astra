// Paletas de cada vídeo. O roteiro escolhe uma com "tema": "<nome>".
export type Tema = {
  fundo: string; // cor de base do quadro
  brilhoA: string; // brilho do gradiente (cenas pares)
  brilhoB: string; // brilho do gradiente (cenas ímpares)
  texto: string;
  suave: string;
  amarelo: string;
  vermelho: string;
  verde: string;
  azul: string;
  cinza: string;
  roxo: string;
  destaque: string; // palavra ativa da legenda, anel das fotos, barra de progresso
  transicao: [string, string, string]; // faixas que cruzam a tela entre cenas
  bandeira?: boolean; // desenha o losango e o círculo da bandeira no fundo
};

export const TEMAS: Record<string, Tema> = {
  padrao: {
    fundo: "#0B0F1A", brilhoA: "#12305C", brilhoB: "#3A1C71", texto: "#FFFFFF", suave: "rgba(255,255,255,0.72)",
    amarelo: "#FFD60A", vermelho: "#FF3B30", verde: "#30D158", azul: "#0A84FF", cinza: "#8E8E93", roxo: "#BF5AF2",
    destaque: "#FFD60A", transicao: ["#FFD60A", "#FF3B30", "#FFFFFF"],
  },
  brasil: {
    fundo: "#011733", brilhoA: "#006B35", brilhoB: "#0B3A8C", texto: "#FFFFFF", suave: "rgba(255,255,255,0.78)",
    amarelo: "#FFDF00", vermelho: "#FF3B30", verde: "#00A859", azul: "#2F6FE4", cinza: "#9AA5B8", roxo: "#2F6FE4",
    destaque: "#FFDF00", transicao: ["#00A859", "#FFDF00", "#2F6FE4"], bandeira: true,
  },
};
