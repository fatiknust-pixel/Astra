import React, { createContext, useContext } from "react";
import { VideoDados } from "./dados";
import { Tema } from "./temas";

const Ctx = createContext<VideoDados | null>(null);

export const ProvedorVideo: React.FC<{ video: VideoDados; children: React.ReactNode }> = ({ video, children }) => (
  <Ctx.Provider value={video}>{children}</Ctx.Provider>
);

export const useVideo = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useVideo fora do ProvedorVideo");
  return v;
};

export const useCor = (): Tema => useVideo().tema;

// "amarelo", "vermelho"... → cor do tema atual
export const corDe = (t: Tema, nome?: string) => (nome && (t as any)[nome]) || t.amarelo;
