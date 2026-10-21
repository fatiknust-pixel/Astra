import { CenaTelas } from "../componentes/CenaTelas";
import { quando } from "../dados";

export const Inventario = () => (
  <CenaTelas
    n={8}
    rotulo="Inventário"
    titulo="Todas as máquinas na palma da mão"
    telas={[{ src: "maquinas", em: 0, razao: 4377 / 1170, rolar: [0, 0.6, 200] }]}
    itens={[
      { nome: "Lista completa", sub: "todas as máquinas e o posto de cada uma", em: quando("inventario", "inventário", 0, 40) },
      { nome: "Situação", sub: "encontradas e não encontradas", em: quando("inventario", "palma", 0, 100) },
      { nome: "Exportar para Excel", sub: "direto, em uma planilha", em: quando("inventario", "Excel", 0, 170) },
    ]}
  />
);
