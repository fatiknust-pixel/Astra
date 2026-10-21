import { CenaTelas } from "../componentes/CenaTelas";
import { quando } from "../dados";

export const Tabela = () => (
  <CenaTelas
    n={4}
    rotulo="Tabela do posto"
    titulo="Escaneou o posto, a tabela aparece"
    telas={[
      { src: "escanear", em: 0 },
      { src: "tabela-posto-14", em: quando("tabela", "tabela", 0, 70), razao: 2619 / 1170, rolar: [0, 0.7, 150] },
    ]}
    itens={[
      { nome: "QR do posto", sub: "lido pela câmera do celular", em: quando("tabela", "QR", 0, 40) },
      { nome: "Tabela completa", sub: "todos os processos do posto", em: quando("tabela", "tabela", 0, 70) },
      { nome: "Torque de cada um", sub: "valores em newton-metro", em: quando("tabela", "torque", 0, 150) },
    ]}
  />
);
