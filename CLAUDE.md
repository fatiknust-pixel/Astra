# CLAUDE.md

Repositório de vídeos do Fabio Sarri, feitos com Remotion 4.0.535 (React + TypeScript).

## Como responder
- Português do Brasil, linguagem simples (o Fabio não é programador).
- Respostas curtas: o resultado e o próximo passo. Sem repetir o que já foi dito.
- Mudanças mínimas: não reescrever arquivos inteiros nem ler o que não precisa.
- Antes de renderizar ou gerar voz (demora e gasta), confirmar o que mudou.

## Projetos
| Pasta | Vídeo | Branch |
|---|---|---|
| `astra-promo/` | Propaganda do app ASTRA (QR Code) | `claude/astra-video-promo` |
| `sbav/` | Apresentação do TCC SBAV (biometria veicular, Fatec Santo André) | `claude/sbav-apresentacao` |

O vídeo do Estúdio Reels fica em outro repositório (`estudio-reels`, pasta `divulgacao/`).

Cada projeto tem duas composições: 16:9 e 9:16 (hook `useFormato()` devolve `{v, W, H}`).

## Estrutura de cada projeto
- `conteudo/roteiro.json` — texto de cada cena e configuração da voz. Editar o texto aqui.
- `scripts/gerar_audio.py` — narração + linha do tempo → `src/gerado/narracao.json` (cache por hash; `--forcar`, `--somente` para refazer cenas).
- `scripts/gerar_sons.py` — trilha e efeitos sintetizados (numpy/scipy).
- `scripts/renderizar.sh [16x9|9x16]` — renderiza em `out/`.
- `src/cenas/` — uma cena por arquivo; `src/Video.tsx` junta tudo com transições.

## Voz
- Motores: `voicestudio` (OmniVoice, clonagem de `voz/referencia.wav`), `edge` (Microsoft), `kokoro` (offline).
- VoiceStudio roda em CPU no GitHub Actions (`.github/workflows/sbav.yml`, `astra-promo.yml`); leva ~30–40 min. O workflow faz commit da narração de volta na branch.
- Rodar workflow: `workflow_dispatch` (input `cenas` para gerar só algumas).

## Render local
```
CHROMIUM_PATH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell bash scripts/renderizar.sh 9x16
```
Áudio final normalizado em -14 LUFS.

## Estilo
- ASTRA / Estúdio Reels: dinâmico, colorido, motion graphics.
- SBAV: sóbrio, grafite e âmbar, técnico mas para leigos, pausas curtas entre cenas.
