import { CenaTelas } from "../componentes/CenaTelas";
import { quando } from "../dados";

export const Alterar = () => (
  <CenaTelas
    n={6}
    rotulo="Alterar dados"
    titulo="Mudança protegida por senha"
    telas={[
      { src: "senha", em: 0 },
      { src: "formulario", em: quando("alterar", "alterar", 0, 40), razao: 2679 / 1170 },
      { src: "maquina-7-encontrada", em: quando("alterar", "segundos", 0, 150) },
    ]}
    itens={[
      { nome: "Senha", sub: "só quem tem acesso altera", em: quando("alterar", "senha", 0, 60) },
      { nome: "Alteração", sub: "dados da máquina e situação", em: quando("alterar", "mudança", 0, 110) },
      { nome: "Em segundos", sub: "salvo e atualizado na hora", em: quando("alterar", "segundos", 0, 150) },
    ]}
  />
);
