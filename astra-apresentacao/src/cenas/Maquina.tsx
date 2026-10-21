import { CenaTelas } from "../componentes/CenaTelas";
import { quando } from "../dados";

export const Maquina = () => (
  <CenaTelas
    n={5}
    rotulo="Ficha da máquina"
    titulo="Cada máquina tem a sua ficha"
    telas={[{ src: "maquina-7", em: 0 }]}
    itens={[
      { nome: "Número de série", sub: "SN-2024-0277", em: quando("maquina", "série", 0, 70) },
      { nome: "Torque", sub: "9 Nm", em: quando("maquina", "torque", 0, 110) },
      { nome: "Posto", sub: "onde a máquina está", em: quando("maquina", "posto", 0, 150) },
      { nome: "Situação", sub: "encontrada ou não encontrada", em: quando("maquina", "situação", 0, 190) },
    ]}
  />
);
