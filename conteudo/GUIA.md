# Guia para escrever um vídeo novo

Cada vídeo é uma pasta `conteudo/<id>/` com dois arquivos: `roteiro.json` e `imagens.json`.
Exemplos completos e aprovados: `conteudo/bolsonaro/` e `conteudo/lula/`. Copie a estrutura deles.

## Regras de conteúdo
- Formato TikTok/Reels 9:16, 1:30 a 2:30 de fala (8 a 11 cenas, 25 a 60 palavras cada).
- **Fatos verificados**: pesquise antes de escrever. Cada cena com fatos traz 2 a 4 `fontes`
  curtas e confiáveis (decisão oficial, órgão público, Agência Brasil, grandes veículos).
  Nunca invente datas, números ou citações. Se não confirmar, não use.
- Temas políticos: tom neutro, mostrar o outro lado (ex.: "a defesa nega…").
- Linguagem falada e simples: "tá", "pra", "né?", conectivos ("Primeiro… Depois… E, por fim…"),
  vírgulas onde se respira. Números por extenso só quando curtos.
- Cena 1 (`gancho`): pergunta + resposta curta que prende ("Foi condenado? Foi.").
- Penúltima cena (`resumo`): resume com `check` (✓/✗).
- Última cena (`final`): pergunta a opinião, pede sugestão de tema e "Segue pra não perder!",
  com `enquete`, `comentario` e `seguir` (copie de `conteudo/bolsonaro/roteiro.json`).

## roteiro.json
(Os comentários `//` abaixo são só explicação: o arquivo final é JSON puro, sem comentários.)
```json
{
  "titulo": "Título curto",
  "estilo": { "paleta": "brasil", "fonte": "montserrat", "legenda": "karaoke", "transicao": "faixas", "fundo": "bandeira", "musica": "tensao", "maiusculas": true },
  "voz": { "edge": "pt-BR-AntonioNeural", "velocidade": "+5%", "kokoro": "pm_alex", "kokoroVelocidade": 1.12 },
  "legenda": { "palavrasPorTela": 3, "corDestaque": "#FFDF00" },
  "cenas": [
    { "id": "gancho", "texto": "Fala da cena…", "fundo": "chave-imagem", "fontes": ["…"], "elementos": [ … ] }
  ]
}
```
- `id` de cena: minúsculas, sem acento, sem espaço.
- `fundo`: chave de `imagens.json` (ou `""` para fundo animado).

## Estilo visual (variar sempre!)
Todo roteiro novo tem um objeto `estilo` (substitui o antigo campo `tema`):
```json
"estilo": { "paleta": "neon", "fonte": "oswald", "legenda": "caixa", "transicao": "deslize",
            "fundo": "ondas", "musica": "leve", "maiusculas": true }
```
| campo | opções |
|---|---|
| `paleta` | `brasil` (verde/amarelo/azul), `padrao` (escuro + amarelo), `jornal` (azul-marinho + vermelho), `neon` (preto + ciano/rosa), `pordosol` (roxo + laranja), `grafite` (cinza + laranja) |
| `fonte` | `montserrat`, `poppins`, `oswald` (condensada, notícia), `raleway`, `playfair` (serifada, documentário), `robotoslab` (serifada forte) |
| `legenda` | `karaoke` (3 palavras, a falada colorida), `palavra` (uma palavra gigante por vez), `caixa` (palavra falada dentro de uma caixa colorida), `discreta` (frase pequena, estilo documentário) |
| `transicao` | `faixas`, `zoom` (zoom com desfoque), `deslize` (cena entra pela lateral), `flash` (clarão branco), `circulo` (abre em círculo) |
| `fundo` | `grade`, `bandeira`, `limpo`, `ondas`, `pontos`, `raios` |
| `musica` | `tensao`, `leve`, `epica`, `nenhuma` |
| `maiusculas` | `true` / `false` (legenda) |
| `dinamica` | ritmo e movimento da edição (veja abaixo) |

### Dinâmica de edição (`estilo.dinamica`)
É o que mais muda a "cara" do vídeo. Combine o resto do estilo com ela:
| dinâmica | como fica | combina com |
|---|---|---|
| `energetica` | "câmera" dá socos de zoom a cada elemento, treme nos carimbos, flash nas trocas | `palavra` ou `caixa`, `zoom`/`flash`, `leve`, cenas curtas e frases curtas |
| `cinema` | faixas pretas, grão de filme, vinheta, zoom lento contínuo | `playfair`, `discreta`, `circulo`/`zoom`, `epica`, ritmo calmo |
| `jornal` | tarja AO VIVO e letreiro correndo com título e fontes, cortes secos | `jornal`, `oswald`, `caixa`, `flash`/`deslize`, tom sério |
| `glitch` | distorção RGB e linhas de TV nas trocas e nos elementos | `neon`, `poppins`, `palavra`, `deslize`, `tensao` |
| `colagem` | papel texturizado, elementos tortos, movimento "stop motion" | `pordosol`/`padrao`, `robotoslab`, `karaoke`, `deslize`, `leve` |
| `minimal` | sem partículas nem texturas, tudo limpo e calmo | `grafite`, `raleway`, `discreta`, `circulo`, `nenhuma`/`leve` |
| `padrao` | o visual original dos vídeos de presidentes | qualquer |
Adapte também o roteiro à dinâmica: `energetica` pede frases curtas e muitos elementos; `cinema` pede menos
elementos, mais `definicao`/`linha` e texto narrativo.

Voz (`voz.edge`): `pt-BR-AntonioNeural` (masculina), `pt-BR-FranciscaNeural` ou `pt-BR-ThalitaNeural` (femininas).

**Regra de variedade:** quando o pedido disser "Automático" (ou não disser nada) num campo, escolha o que combina
com o tema, mas **leia o `estilo` e a voz dos 3 vídeos mais recentes** (pastas `conteudo/issue-*`, maior número = mais
recente; e `conteudo/bolsonaro`, `conteudo/lula`) e **não repita a mesma dinâmica, paleta, legenda, transição nem fundo** do
vídeo anterior. Combine para formar uma identidade coerente (ex.: notícia → `jornal` + `oswald` + `caixa` + `flash`;
história → `pordosol` + `playfair` + `discreta` + `zoom` + `epica`; curiosidade leve → `neon` + `poppins` + `palavra` +
`deslize` + `leve`).

## Formatos de roteiro (variar também)
- **Explicativo** (padrão dos vídeos de presidentes): gancho → contexto → fatos em ordem → resumo → final.
- **Lista/Top N**: "5 coisas que…", uma cena por item, `contador` ou `titulo` com o número.
- **Linha do tempo**: cenas por data, `linha` e `titulo` com o ano em destaque.
- **Mito ou verdade**: cada cena começa com a afirmação e um `carimbo` MITO/VERDADE.
- **Comparação**: A × B, `placar` e `check` lado a lado.
- **Curiosidade rápida**: 40–60 s, 5–6 cenas, ritmo acelerado.
Se o pedido não indicar o formato, escolha o mais adequado e evite repetir o formato do vídeo anterior.

## Elementos animados
Cada elemento tem `tipo`, `posicao` e `em` (quando aparece).
- `em`: uma **palavra que existe no `texto` da cena** (aparece quando ela é falada) ou um número
  (índice da palavra; `0` = início da cena). Evite palavras que se repetem antes do ponto certo.
- `posicao`: `topo`, `alto`, `alto2`, `meio`, `meio2`. Um elemento novo na mesma posição substitui o
  anterior (exceto `carimbo`, que fica por cima). Use no máximo 2 elementos visíveis ao mesmo tempo
  em `alto`/`alto2`; elementos grandes (`pessoa`, `contador`, `placar`, `definicao`, `mapa`, `relogio`)
  vão em `alto`.
- Cores (`cor`): `amarelo`, `verde`, `azul`, `vermelho`, `cinza`.

| tipo | campos |
|---|---|
| `titulo` | `texto`, `sub?`, `cor?` |
| `pergunta` | `texto` (grande, ex.: "PRESO?") |
| `carimbo` | `texto`, `cor` |
| `tag` | `texto`, `icone`, `cor?` |
| `pessoa` | `imagem` (chave), `nome`, `cargo` |
| `icones` | `itens`: [["icone","rótulo"], ["seta",""], …] (até 3) |
| `contador` | `de`, `ate`, `unidade`, `rotulo?` |
| `linha` | `itens`: [["data","rótulo"], …] (2 ou 3) |
| `definicao` | `palavra`, `significado` |
| `mapa` | `de`, `para` (cidades) |
| `placar` | `sim`, `nao`, `rotulo`, `rotuloSim?`, `rotuloNao?`, `decimais?`, `cores?` |
| `relogio` | `rotulo` (prazo cortado pela metade) |
| `check` | `texto`, `ok` (true/false), `nota` |
| `enquete` | `pergunta`, `opcoes` (2) |
| `comentario` | `texto` |
| `seguir` | `texto` |

Ícones: `predio`, `casa`, `seta`, `contrato`, `documento`, `dinheiro`, `lavagem`, `martelo`, `balanca`,
`obra`, `relogio`, `check`, `x`, `pin`, `mais`, `urna`, `alvo`, `alerta`, `celular`, `tornozeleira`,
`cruz`, `balao`.

## imagens.json
Fotos livres da Wikipédia/Wikimedia Commons (baixadas automaticamente, com crédito):
```json
{
  "pessoa-x": { "wiki": "Nome do artigo na Wikipédia em português", "rotulo": "Nome" },
  "lugar-y": { "commons": "termos de busca no Commons", "wiki": "Artigo", "rotulo": "Legenda" }
}
```
A ordem das chaves `wiki`/`commons` é a ordem de tentativa. Se nada for encontrado, o vídeo usa
um fundo animado no lugar, então não dependa de uma foto específica.
