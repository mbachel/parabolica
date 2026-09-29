#!/usr/bin/env bash
# Runs before Claude edits or writes a file (PreToolUse on Edit|Write|MultiEdit).
# Blocks content that looks like a real secret. References like ${GITHUB_PAT} pass.
# Exit 2 blocks the edit and shows the message to Claude.

input=$(cat)

if printf '%s' "$input" | grep -Eq '(ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{50,}|AKIA[0-9A-Z]{16}|sk-ant-[A-Za-z0-9_-]{20,}|xox[abprs]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)'; then
  echo "Blocked by .claude/hooks/check-secrets.sh: the edit contains something that looks like a real secret. Use an environment variable instead." >&2
  exit 2
fi

exit 0
