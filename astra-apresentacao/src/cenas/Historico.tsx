import { CenaTelas } from "../componentes/CenaTelas";
import { quando } from "../dados";

export const Historico = () => (
  <CenaTelas
    n={7}
    rotulo="Histórico"
    titulo="Tudo fica registrado"
    telas={[{ src: "historico", em: 0 }]}
    itens={[
      { nome: "Quem", sub: "o usuário que fez a alteração", em: quando("historico", "quem", 0, 80) },
      { nome: "O que mudou", sub: "o dado alterado", em: quando("historico", "mudou", 0, 120) },
      { nome: "Quando", sub: "data e hora do registro", em: quando("historico", "quando", 0, 160) },
    ]}
  />
);
