# Astra — guia para o Claude

Vídeos em motion graphics (Remotion + React) com narração edge-tts, legenda palavra por palavra e imagens da Wikimedia. Cada vídeo mora em `conteudo/<id>/` (roteiro e imagens). Vídeos prontos: `lula`, `bolsonaro`, `issue-2`, `issue-3`, `5s` (projeto 5S, 16:9).
- Fábrica: Issue `Vídeo: …` no GitHub → Claude escreve o roteiro → voz + imagens + MP4.

## Regras de economia (siga sempre)

1. **Respostas curtas.** Português, direto. Sem repetir o pedido, sem resumo longo do que fez, sem explicar código que não pedi. Ao terminar: 1 a 3 linhas (o que mudou e onde).
2. **Leia pouco.** Use o mapa abaixo para ir direto ao arquivo. Leia só o trecho necessário (offset/limit, grep). Não explore o repositório "para entender".
3. **Nunca leia sem eu pedir:** `public/` (áudio, imagens, fontes), `src/gerado/`, `package-lock.json`, `node_modules/`, `out/`, `scripts/__pycache__`. `src/videos.ts` é gerado, não edite.
4. **Não rode comandos à toa.** Para conferir código: `npm run typecheck`. Não rode render, áudio ou download de imagens a menos que eu peça.
5. **Pedido ambíguo:** faça a interpretação mais provável e diga em uma linha o que assumiu, em vez de fazer várias perguntas.
6. Não crie arquivos novos (docs, testes, README) sem eu pedir.

## Qual modelo usa cada trabalho

| Trabalho | Quem faz |
|---|---|
| Pesquisa na web, conferir fatos, achar onde algo está no código | subagente `pesquisador` (Haiku) |
| Escrever texto: roteiro, narração, títulos, legendas, docs | subagente `redator` (Sonnet) |
| Mudança simples (cor, texto, valor, um componente) | sessão principal, direto, sem subagente |
| Bug difícil, mudança em vários arquivos, workflows, `src/dados.ts` | sessão principal (Opus) |

- Delegue para o subagente só quando a tarefa for grande. Para 1 ou 2 buscas, faça direto.
- Peça aos subagentes só a conclusão (caminhos `arquivo:linha` ou fatos com fonte), nunca o conteúdo dos arquivos.
- Modelo da sessão (`/model`): **Sonnet** no dia a dia; **Opus** só para trabalho difícil.

## Mapa: "quero arrumar X" → onde mexer

### Conteúdo (o que o vídeo diz e mostra)
| Assunto | Arquivo |
|---|---|
| Texto da narração, cenas, elementos, voz, legenda de um vídeo | `conteudo/<id>/roteiro.json` |
| Imagens do vídeo (chaves, termos de busca) | `conteudo/<id>/imagens.json` |
| Regras para escrever roteiros | `conteudo/GUIA.md` |
| Projeto 5S: casos, narração, cenas | `conteudo/5s/casos.json`, `roteiro.json`, `video.json` |

### Visual (Remotion) — `src/`
| Assunto | Arquivo |
|---|---|
| Composição das cenas | `src/Video.tsx` |
| Registro dos vídeos / durações | `src/Root.tsx`, `src/dados.ts` (afeta tudo) |
| Estado compartilhado do vídeo | `src/contexto.tsx` |
| Elementos animados (título, contador, mapa, placar, enquete…) | `src/componentes/Elementos.tsx` |
| Legenda palavra por palavra | `src/componentes/Legenda.tsx` |
| Fundo e fotos | `src/componentes/Fundo.tsx` |
| Dinâmica de câmera/transições | `src/componentes/Dinamica.tsx` |
| Ícones | `src/componentes/Icone.tsx` |
| Cores/paletas | `src/temas.ts` |
| Fontes | `src/tema.ts` (arquivos em `public/fonts/`) |
| Projeto 5S em vídeo | `src/cinco-s/Projeto5S.tsx` |
| Projeto 5S em PowerPoint | `apresentacao/gerar-pptx.cjs` |

### Scripts, prévia e automação
| Assunto | Arquivo |
|---|---|
| Narração (edge-tts) e tempo por palavra | `scripts/gerar_audio.py` |
| Baixar imagens e créditos | `scripts/baixar-imagens.mjs` |
| Registrar vídeos (gera `src/videos.ts`) | `scripts/registrar-videos.mjs` |
| Efeitos sonoros | `scripts/gerar-sfx.sh` |
| Prévia no navegador | `preview/` |
| App no celular (PWA) | `public/app/` |
| Fábrica Issue → MP4 | `.github/workflows/fabrica.yml` |
| Narração, prévia e render no push | `.github/workflows/video.yml` |
| Config global de economia do Claude | `config-claude/` |

## Comandos
```bash
npm run studio     # prévia ao vivo (Remotion Studio)
npm run typecheck  # conferir código (use este para validar)
npm run audio      # narração (só cenas alteradas), só se eu pedir
npm run render     # MP4 1080x1920, só se eu pedir
```
