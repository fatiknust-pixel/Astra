# ASTRA: vídeo de apresentação (16:9 e 9:16)

Vídeo-propaganda do aplicativo ASTRA, feito com [Remotion](https://github.com/remotion-dev/remotion) (vídeo escrito em React).
Tem cerca de 45 segundos, em dois formatos (16:9 em 1920×1080 e 9:16 em 1080×1920), a 30 quadros por segundo,
com narração, legenda, trilha e efeitos sonoros. Cada cena reorganiza o layout conforme o formato.

Usa **somente dados fictícios** e as telas reais do protótipo, **sem o logo da empresa** (ele é bloqueado na captura).

## Roteiro

| Cena | O que mostra |
|---|---|
| `abertura` | Medidor de torque enchendo até 7,4 N·m. "Na linha de montagem, cada aperto conta." |
| `problema` | Folhas espalhadas e máquina "não encontrada", com efeito de falha digital. |
| `revelacao` | Logo do ASTRA se desenhando, anéis de energia e o "drop" da música. |
| `escanear` | Celular lê o QR `TAB:posto-14` e a tabela de torque aparece, linha por linha. |
| `maquina` | QR `MAQ:7` e linhas ligando cada campo da ficha a um rótulo. |
| `alterar` | Senha, formulário e a situação virando de "Não encontrada" para "Encontrada". |
| `historico` | Linha do tempo com quem, o que e quando, em blocos de 5 minutos. |
| `inventario` | Gráfico de encontradas e não encontradas e a lista indo para a planilha. |
| `plataformas` | iPhone, Android e computador, e o funcionamento sem internet. |
| `final` | "ASTRA. Escaneou, resolveu." e os créditos dos autores. |

O texto falado fica em `conteudo/roteiro.json`. Se mudar uma frase, só aquela cena ganha áudio novo, e o tempo
de todas as cenas e da música se ajusta sozinho.

## Bibliotecas usadas (todas do GitHub, código aberto)

- `remotion`, `@remotion/transitions` (slide, wipe, iris, fade), `@remotion/paths` (traços se desenhando),
  `@remotion/noise` (partículas e tremor de câmera), `@remotion/shapes` (parafuso sextavado) e `@remotion/fonts`.
- `qrcode-generator`: os QR Codes que aparecem no vídeo são reais e podem ser lidos pelo app.
- [edge-tts](https://github.com/rany2/edge-tts): voz neural (pt-BR-AntonioNeural). Se ela falhar, entra a voz offline
  [Kokoro](https://github.com/thewh1teagle/kokoro-onnx).
- Trilha e efeitos sonoros são **sintetizados** em `scripts/gerar_sons.py` (numpy/scipy), sem direitos autorais.
  A música tem 120 BPM e os cortes de cena caem na batida.
- Fontes IBM Plex (licença OFL), as mesmas do app.

## Como gerar

O jeito mais fácil é pelo GitHub: **Actions → Vídeo ASTRA → Run workflow**. Os dois MP4 ficam em *Artifacts* da execução.
Cada alteração em `astra-promo/` também dispara o workflow.

No computador:

```bash
cd astra-promo
npm install
pip install edge-tts numpy scipy
npm run audio            # narração (voz da Microsoft) e linha do tempo
npm run sons             # trilha e efeitos no ritmo da narração
npm run studio           # prévia com linha do tempo
npm run render           # out/astra-promo-16x9.mp4 e out/astra-promo-9x16.mp4
```

Para refazer as telas do app: rode o ASTRA em `http://localhost:8765` (`python -m http.server 8765` na pasta do app)
e depois `npm run telas -- http://localhost:8765`. O código do app não fica neste repositório.
