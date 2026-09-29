#!/usr/bin/env bash
# Runs before every shell command Claude Code executes.
# Blocks commands that wipe the local database or change cloud infrastructure.
# Claude Code sends the tool call as JSON on stdin; exit 2 blocks it and shows stderr to Claude.

input=$(cat)

# Pull out tool_input.command without jq.
cmd=$(printf '%s' "$input" | sed -nE 's/.*"command"[[:space:]]*:[[:space:]]*"(([^"\\]|\\.)*)".*/\1/p')
[ -z "$cmd" ] && cmd="$input"

block() {
  echo "Blocked by .claude/hooks/validate-bash.sh: $1. A person has to run this by hand." >&2
  exit 2
}

# docker compose down -v / --volumes (deletes the Postgres volume)
if printf '%s' "$cmd" | grep -Eq 'docker(-compose|[[:space:]]+compose)([[:space:]].*)?[[:space:]]down([[:space:]].*)?[[:space:]]-(v|-volumes)([[:space:]]|$)'; then
  block "docker compose down -v deletes the local database"
fi

# docker volume rm / prune
if printf '%s' "$cmd" | grep -Eq 'docker[[:space:]]+volume[[:space:]]+(rm|prune)'; then
  block "removing Docker volumes deletes the local database"
fi

# docker system prune --volumes
if printf '%s' "$cmd" | grep -Eq 'docker[[:space:]]+system[[:space:]]+prune.*--volumes'; then
  block "pruning volumes deletes the local database"
fi

# terraform apply / destroy, including with flags like -chdir= before the subcommand
if printf '%s' "$cmd" | grep -Eq 'terraform([[:space:]]+-[^[:space:]]+)*[[:space:]]+(apply|destroy)([[:space:]]|$)'; then
  block "terraform apply and destroy change real infrastructure"
fi

exit 0