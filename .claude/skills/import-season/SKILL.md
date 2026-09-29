---
name: import-season
description: Import a NASCAR season's race list, or one race's weekend feed, into the local database through the admin import API.
argument-hint: <year> | weekend-feed <year> <seriesId> <raceId>
disable-model-invocation: true
allowed-tools: Bash(bash .claude/skills/import-season/import.sh *)
---

Import NASCAR historical data into the local Docker database.

1. Confirm the stack is running: `docker compose ps` should show backend and db up. If not, tell the user to run `docker compose up -d`.
2. From the repo root, run:
   - A season's race list: `bash .claude/skills/import-season/import.sh race-list-basic $0`
   - One race's weekend feed: `bash .claude/skills/import-season/import.sh weekend-feed <year> <seriesId> <raceId>`
   - Add `force` at the end to re-import data that already exists.
3. Report the HTTP status and the response body. On 401, the admin key in `.env` doesn't match the running backend.

Never print or read the admin key. The script reads it from `.env` itself.