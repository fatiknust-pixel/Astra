# Lula: inocentado ou condenado? — vídeo 9:16 para TikTok

Vídeo em **motion graphics** feito com [Remotion](https://github.com/remotion-dev/remotion) (vídeo em React),
narração neural com [edge-tts](https://github.com/rany2/edge-tts) (fallback offline:
[Kokoro](https://github.com/thewh1teagle/kokoro-onnx)), **legenda palavra por palavra**, fontes na tela,
fotos da Wikipédia/Wikimedia Commons e automação no **GitHub Actions**.

## Editar sem renderizar

Tudo que aparece no vídeo vem de **`conteudo/roteiro.json`**:

| Campo | O que faz |
|---|---|
| `texto` | O que a voz fala (e a legenda). Mudou o texto → só aquela cena ganha áudio novo. |
| `fontes` | Fontes exibidas no topo da cena. |
| `fundo` | Imagem de fundo (chave de `conteudo/imagens.json`). |
| `elementos` | Gráficos animados. `em` = palavra da narração em que o elemento aparece. |
| `voz` | Voz e velocidade (`pt-BR-AntonioNeural`, `pt-BR-FranciscaNeural`, `pt-BR-ThalitaMultilingualNeural`…). |
| `legenda` | Palavras por tela e cor do destaque. |

Tipos de elemento: `titulo`, `pergunta`, `carimbo`, `tag`, `pessoa`, `icones`, `contador`, `linha`,
`definicao`, `mapa`, `placar`, `relogio`, `check`, `enquete`, `comentario`, `seguir`.
Posições: `topo`, `alto`, `alto2`, `meio`, `meio2`.

### Prévia instantânea (sem gerar MP4)

- **No computador:** `npm install` e depois `npm run studio` (Remotion Studio, editor com linha do tempo)
  ou `npm run preview` (player simples). Salvou o arquivo → a prévia atualiza na hora.
- **Pelo GitHub:** cada push roda o workflow, gera a narração das cenas alteradas e publica a prévia no
  GitHub Pages (ative em *Settings → Pages → Source: GitHub Actions*).

### MP4 final

- GitHub: *Actions → Vídeo → Run workflow* (com "Renderizar" marcado), ou um commit com `[render]` na
  mensagem. O MP4 fica em *Artifacts* da execução.
- Local: `npm run render` → `out/video.mp4`.

## Comandos

```bash
npm install
pip install edge-tts           # voz neural
npm run audio                  # narração (só cenas alteradas)
npm run imagens                # baixa fotos + créditos (autor/licença)
npm run sfx                    # efeitos sonoros gerados com ffmpeg
npm run studio                 # editor/prévia ao vivo
npm run render                 # MP4 1080x1920
```

## Fontes usadas no roteiro

- STF — HC 193.726 (Fachin, 08/03/2021; plenário confirma por 8 a 3 em 15/04/2021): incompetência da 13ª Vara de Curitiba.
- STF — HC 164.493 (2ª Turma, 23/03/2021; plenário mantém por 7 a 4 em 23/06/2021): suspeição de Sergio Moro.
- STF — ADCs 43, 44 e 54 (07/11/2019): prisão só após o trânsito em julgado.
- Código Penal, art. 115: prazos de prescrição caem pela metade para quem tem mais de 70 anos na data da sentença.
- Constituição Federal, art. 5º, LVII: presunção de inocência.
- JF-DF, 12ª Vara: Atibaia — denúncia rejeitada e punibilidade extinta (ago/2021); Tríplex — arquivado por prescrição a pedido do MPF (27/01/2022).
- Reportagens: [Poder360 — tríplex arquivado](https://www.poder360.com.br/justica/justica-arquiva-caso-do-triplex-contra-lula/),
  [Poder360 — suspeição de Moro](https://www.poder360.com.br/justica/stf-mantem-decisao-que-declarou-moro-parcial-no-caso-triplex/),
  [Jovem Pan — Atibaia](https://jovempan.com.br/noticias/politica/justica-do-federal-do-df-rejeita-denuncia-contra-lula-no-caso-do-sitio-de-atibaia.html),
  [Conjur — anulação](https://www.conjur.com.br/2021-mar-08/fachin-declara-perda-objeto-julgamento-suspeicao-sergio-moro/).

Imagens: Wikimedia Commons; autor e licença de cada uma ficam em `src/gerado/imagens.json` e aparecem no vídeo.

## Projeto 5S — apresentação + vídeo (16:9)

Fotos em `public/5s/fotos/`, casos (antes/depois, problema, ação, sensos) em `conteudo/5s/casos.json`
e narração do vídeo em `conteudo/5s/video.json`. Os dois entregáveis leem esses arquivos.

```bash
npm run pptx                                  # out/Projeto-5S.pptx (PowerPoint, importável no Canva)
pip install kokoro-onnx soundfile             # voz offline; modelo em modelos/ (kokoro-v1.0.onnx + voices-v1.0.bin)
npm run audio:5s                              # narração por cena -> public/5s/audio + src/gerado/5s/narracao.json
npm run studio                                # prévia: composição "Projeto5S"
npm run render:5s                             # out/Projeto-5S.mp4 (1920x1080)
```

Para trocar a voz, mude `voz` em `conteudo/5s/video.json` (`pm_alex`, `pf_dora`, `pm_santa`).
Quando as fotos do "depois" das áreas pendentes chegarem: coloque em `public/5s/fotos/`, preencha
`depois`, `acao` e `sensos` do caso, mude `status` para `concluido`, acrescente uma cena `"tipo": "caso"`
em `conteudo/5s/video.json` (e tire a área da cena `pendentes`) e rode de novo.
