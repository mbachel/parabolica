#!/usr/bin/env bash
# One-time setup, per machine, for Parabolica's Claude Code tools.
# Run from Git Bash (Windows) or a terminal (macOS/Linux):  bash scripts/setup-claude-tools.sh
# Safe to run again: anything already installed is skipped.
#
# What it does:
#   1. Checks the tools the plugins need (Claude Code CLI, Node, .NET SDK, Python, Docker)
#   2. Installs the C# and TypeScript language servers
#   3. Installs the shared plugins at project scope (this writes to .claude/settings.json)
#   4. Adds the Playwright MCP server for this project, on this machine only
# It never runs git. Commit any .claude/settings.json change yourself.

set -u
cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" || exit 1

have() { command -v "$1" >/dev/null 2>&1; }
ok()   { printf '  [ok]      %s\n' "$1"; }
todo() { printf '  [missing] %s\n' "$1"; MISSING=1; }
MISSING=0

case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*) WINDOWS=1 ;;
  *) WINDOWS=0 ;;
esac

PLUGINS="feature-dev@claude-plugins-official csharp-lsp@claude-plugins-official typescript-lsp@claude-plugins-official claude-security@claude-plugins-official ui-ux-pro-max@ui-ux-pro-max-skill"

echo "1. Prerequisites"
if have claude; then ok "Claude Code CLI"; else todo "Claude Code CLI (plugin steps below will print what to run in VS Code instead)"; fi
if have node && have npm; then ok "Node.js and npm"; else todo "Node.js (needed for Playwright and the TypeScript language server)"; fi
if have dotnet; then ok ".NET SDK"; else todo ".NET SDK (needed for the C# language server)"; fi
if py -3 --version >/dev/null 2>&1 || python3 --version >/dev/null 2>&1 || python --version >/dev/null 2>&1; then
  ok "Python 3"
else
  todo "Python 3 (needed by UI/UX Pro Max and claude-security)"
fi
if have docker; then ok "Docker"; else todo "Docker"; fi

echo
echo "2. Language servers"
if have csharp-ls; then
  ok "csharp-ls"
elif have dotnet; then
  dotnet tool install --global csharp-ls && ok "csharp-ls installed"
else
  todo "csharp-ls (install the .NET SDK, then rerun)"
fi
if have typescript-language-server; then
  ok "typescript-language-server"
elif have npm; then
  npm install -g typescript-language-server typescript && ok "typescript-language-server installed"
else
  todo "typescript-language-server (install Node.js, then rerun)"
fi

echo
echo "3. Plugins (project scope)"
if have claude; then
  claude plugin marketplace add anthropics/claude-plugins-official >/dev/null 2>&1 || true
  claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill --scope project >/dev/null 2>&1 || true
  for p in $PLUGINS; do
    if claude plugin install "$p" --scope project >/dev/null 2>&1; then
      ok "$p"
    elif claude plugin list 2>/dev/null | grep -q "${p%@*}"; then
      ok "$p (already installed)"
    else
      todo "$p (install failed; run: claude plugin install $p --scope project)"
    fi
  done
else
  echo "  The claude CLI isn't on PATH. In the VS Code Claude Code panel, type /plugins and install these for this project:"
  for p in $PLUGINS; do echo "    $p"; done
  echo "  Add the marketplace nextlevelbuilder/ui-ux-pro-max-skill first, on the Marketplaces tab."
fi

echo
echo "4. Playwright MCP (this machine only)"
if have claude; then
  if claude mcp get playwright >/dev/null 2>&1; then
    ok "playwright (already added)"
  elif [ "$WINDOWS" = 1 ]; then
    claude mcp add --scope local playwright -- cmd /c npx -y @playwright/mcp@latest --ignore-https-errors && ok "playwright added"
  else
    claude mcp add --scope local playwright -- npx -y @playwright/mcp@latest --ignore-https-errors && ok "playwright added"
  fi
else
  todo "playwright MCP (needs the Claude Code CLI; install it, then run this script again)"
fi

echo
if [ "$MISSING" = 1 ]; then
  echo "Done, with items marked [missing]. Install those and run this script again."
else
  echo "Done. Restart Claude Code (or run /reload-plugins), then run /plugin and /mcp to confirm."
fi
echo "If .claude/settings.json changed, review and commit it yourself."
