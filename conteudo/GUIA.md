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
  "tema": "brasil",            // "brasil" (verde/amarelo/azul) ou "padrao" (escuro/amarelo)
  "voz": { "edge": "pt-BR-AntonioNeural", "velocidade": "+5%", "kokoro": "pm_alex", "kokoroVelocidade": 1.12 },
  "legenda": { "palavrasPorTela": 3, "corDestaque": "#FFDF00" },
  "cenas": [
    { "id": "gancho", "texto": "Fala da cena…", "fundo": "chave-imagem", "fontes": ["…"], "elementos": [ … ] }
  ]
}
```
- `id` de cena: minúsculas, sem acento, sem espaço.
- `fundo`: chave de `imagens.json` (ou `""` para fundo animado).

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
