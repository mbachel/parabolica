#!/usr/bin/env bash
# Usage: import.sh race-list-basic <year> [force]
#        import.sh weekend-feed <year> <seriesId> <raceId> [force]
# Reads ADMIN__KEY from .env so the key never appears in Claude's context.
set -euo pipefail

root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"
key=$(grep -E '^ADMIN__KEY=' "$root/.env" | head -n1 | cut -d= -f2- | tr -d '\r"')
[ -n "$key" ] || { echo "ADMIN__KEY is not set in .env" >&2; exit 1; }

base="https://localhost/api/admin/import/nascar"
force=false

case "${1:-}" in
  race-list-basic)
    [ "${3:-}" = "force" ] && force=true
    url="$base/race-list-basic"
    body="{\"year\": $2, \"force\": $force}"
    ;;
  weekend-feed)
    [ "${5:-}" = "force" ] && force=true
    url="$base/weekend-feed"
    body="{\"year\": $2, \"seriesId\": $3, \"raceId\": $4, \"force\": $force}"
    ;;
  *)
    echo "usage: import.sh race-list-basic <year> [force] | weekend-feed <year> <seriesId> <raceId> [force]" >&2
    exit 1
    ;;
esac

# -k: local nginx uses a self-signed certificate
curl -sk -X POST "$url" \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: $key" \
  -d "$body" \
  -w '\nHTTP %{http_code}\n'