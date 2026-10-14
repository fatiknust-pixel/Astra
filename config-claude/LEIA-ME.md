# Economia de tokens no Claude Code (todos os projetos)

`instalar.sh` grava em `~/.claude/` (configuração global do usuário):

- `settings.json` → `model: opusplan` (Opus planeja, Sonnet executa) e `effortLevel: medium`
- `agents/pesquisador.md` → agente com Haiku e esforço baixo para buscas e resumos simples
- `CLAUDE.md` → regras para delegar tarefas simples ao pesquisador

## Onde rodar

- **Claude Code na nuvem (app/claude.ai/code):** cole o conteúdo de `instalar.sh` no *Setup script*
  do ambiente (menu do ambiente no topo da sessão → Edit). Roda no início de cada sessão nova.
- **Claude Code no computador:** `bash config-claude/instalar.sh` uma vez.

Ajustes na hora: `/model haiku|sonnet|opus`, `/effort low|medium|high`, ou escreva *ultrathink* na mensagem.
