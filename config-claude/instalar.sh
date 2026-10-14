#!/usr/bin/env bash
# Configuração global do Claude Code para economizar tokens (vale para todos os projetos).
# - Modelo padrão: opusplan (Opus para planejar, Sonnet para executar), esforço médio
# - Agente "pesquisador" (Haiku, esforço baixo) para buscas e resumos simples
# - Regras de economia no CLAUDE.md global
# Pode rodar quantas vezes quiser: não apaga o que já existe nas suas configurações.
set -e
D="$HOME/.claude"
mkdir -p "$D/agents"

# 1) settings.json: só acrescenta model/effortLevel, mantendo o resto
python3 - "$D/settings.json" <<'PY'
import json, os, sys
p = sys.argv[1]
s = {}
if os.path.exists(p):
    try:
        s = json.load(open(p))
    except Exception:
        s = {}
s.setdefault("model", "opusplan")
s.setdefault("effortLevel", "medium")
json.dump(s, open(p, "w"), indent=2, ensure_ascii=False)
PY

# 2) agente pesquisador (modelo barato para tarefas simples)
cat > "$D/agents/pesquisador.md" <<'EOF'
---
name: pesquisador
description: Use para buscas simples, pesquisas rápidas na web, achar arquivos ou trechos de código e resumir documentos. Não use para escrever código, revisar código ou decidir arquitetura.
model: haiku
effort: low
tools: Read, Grep, Glob, WebSearch, WebFetch
---
Faça a busca pedida e devolva só o essencial, em tópicos curtos, com caminhos de arquivo ou links das fontes. Não invente: se não achar, diga que não achou.
EOF

# 3) regras de economia no CLAUDE.md global (adiciona uma vez só)
M="$D/CLAUDE.md"
touch "$M"
if ! grep -q "## Economia de tokens" "$M"; then
cat >> "$M" <<'EOF'

## Economia de tokens
- Pesquisas simples, buscas em arquivos e resumos: delegue ao agente "pesquisador" (Haiku).
- Tarefas comuns de código: resolva direto, sem planejamento longo.
- Raciocínio pesado só para planejar mudanças grandes, depurar problemas difíceis ou decisões de arquitetura.
- Respostas objetivas: sem repetir o que o usuário já disse nem resumir o que acabou de fazer em detalhes.
EOF
fi
echo "Configuração de economia de tokens aplicada em $D"
