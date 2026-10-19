# SBAV: apresentação do TCC em vídeo (16:9 e 9:16)

Vídeo de apresentação do TCC **SBAV – Sistema Biométrico de Autenticação Veicular**
(Tecnologia em Eletrônica Automotiva, Fatec Santo André), feito com [Remotion](https://github.com/remotion-dev/remotion).
Linguagem simples na narração, com os termos técnicos explicados na tela. Visual sóbrio: grafite, branco e um
único destaque âmbar; verde e vermelho só para liberado/bloqueado.

Todo o conteúdo vem do artigo resumido do TCC; as fotos são do protótipo (recortadas para não mostrar pessoas).

## Cenas

| # | Cena | Conteúdo |
|---|---|---|
| 1 | Apresentação | Título, instituição e curso, com a digital sendo desenhada e lida. |
| 2 | O problema | Chave copiada e abertura à distância. |
| 3 | A proposta | Leitura → comparação → partida liberada; digital não reconhecida → bloqueio. |
| 4 | Como funciona | Diagrama: leitor (UART 57.600 bps) → Raspberry Pi Pico W → relé 5 V → linha +15, com glossário. |
| 5 | Passo a passo | Máquina de estados: espera, leitura, liberado, bloqueado. |
| 6 | Segurança | Relé normalmente aberto (fail-safe) e diodo 1N4007. |
| 7 | O desafio | Biblioteca do sensor reescrita do Arduino para o SDK do Pico. |
| 8 | O protótipo | Fotos da placa e do painel, com os componentes indicados. |
| 9 | Testes | Resultados em bancada e critérios de aprovação. |
| 10 | Conclusão | Viável, de baixo custo, ideal para carros antigos. |
| 11 | Próximos passos | PCB, validação no Gol 1994, liberação pelo celular, integração CAN. |
| 12 | Créditos | Autores, curso e instituição. |

O texto falado fica em `conteudo/roteiro.json`.

## Como gerar

Pelo GitHub: **Actions → Apresentação SBAV → Run workflow**. Os dois MP4 ficam em *Artifacts*.
A narração usa o [VoiceStudio](https://github.com/debpalash/VoiceStudio) com a mesma voz salva em `voz/`
(ou a voz da Microsoft, escolhendo `edge`).

No computador: `npm install`, `npm run audio`, `npm run sons`, `npm run render`.
