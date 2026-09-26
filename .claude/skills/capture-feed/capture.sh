#!/usr/bin/env bash
# Usage: capture.sh <scenario> [count=10] [interval-seconds=30]
# Saves NASCAR's live feed to test-data/nascar/live/<scenario>/01.json, 02.json, ...
set -euo pipefail

[ -n "${1:-}" ] || { echo "usage: capture.sh <scenario> [count] [interval]" >&2; exit 1; }

root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"
dir="$root/test-data/nascar/live/$1"
count="${2:-10}"
interval="${3:-30}"

if [ -d "$dir" ] && [ -n "$(ls -A "$dir")" ]; then
  echo "$dir already has files; pick another scenario name or clear it first" >&2
  exit 1
fi
mkdir -p "$dir"

for i in $(seq 1 "$count"); do
  file="$dir/$(printf '%02d' "$i").json"
  curl -sf "https://cf.nascar.com/live/feeds/live-feed.json" -o "$file"
  echo "saved $file"
  if [ "$i" -lt "$count" ]; then sleep "$interval"; fi
done