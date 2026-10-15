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
  jornal: {
    fundo: "#0A0F1F", brilhoA: "#1B2A55", brilhoB: "#3A0D12", texto: "#FFFFFF", suave: "rgba(255,255,255,0.75)",
    amarelo: "#FFFFFF", vermelho: "#E11D2E", verde: "#1FA971", azul: "#2563EB", cinza: "#94A3B8", roxo: "#2563EB",
    destaque: "#E11D2E", transicao: ["#E11D2E", "#FFFFFF", "#1B2A55"],
  },
  neon: {
    fundo: "#06030F", brilhoA: "#2B0A4F", brilhoB: "#00363F", texto: "#FFFFFF", suave: "rgba(255,255,255,0.75)",
    amarelo: "#00F0FF", vermelho: "#FF2E88", verde: "#39FF88", azul: "#7B61FF", cinza: "#8B8BA7", roxo: "#C14BFF",
    destaque: "#00F0FF", transicao: ["#FF2E88", "#00F0FF", "#7B61FF"],
  },
  pordosol: {
    fundo: "#1A0B1E", brilhoA: "#5A1F3D", brilhoB: "#6B3A12", texto: "#FFFFFF", suave: "rgba(255,255,255,0.78)",
    amarelo: "#FFB547", vermelho: "#FF5E5B", verde: "#4ADE80", azul: "#A78BFA", cinza: "#B8A6B0", roxo: "#E879F9",
    destaque: "#FFB547", transicao: ["#FF5E5B", "#FFB547", "#E879F9"],
  },
  grafite: {
    fundo: "#111111", brilhoA: "#2A2A2A", brilhoB: "#1F2A2E", texto: "#FFFFFF", suave: "rgba(255,255,255,0.72)",
    amarelo: "#FF7A1A", vermelho: "#FF4040", verde: "#3DDC97", azul: "#4AA3FF", cinza: "#9CA3AF", roxo: "#4AA3FF",
    destaque: "#FF7A1A", transicao: ["#FF7A1A", "#FFFFFF", "#2A2A2A"],
  },
  brasil: {
    fundo: "#011733", brilhoA: "#006B35", brilhoB: "#0B3A8C", texto: "#FFFFFF", suave: "rgba(255,255,255,0.78)",
    amarelo: "#FFDF00", vermelho: "#FF3B30", verde: "#00A859", azul: "#2F6FE4", cinza: "#9AA5B8", roxo: "#2F6FE4",
    destaque: "#FFDF00", transicao: ["#00A859", "#FFDF00", "#2F6FE4"], bandeira: true,
  },
};
