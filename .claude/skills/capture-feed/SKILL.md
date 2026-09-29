---
name: capture-feed
description: Save consecutive polls of NASCAR's live feed into test-data as a mock-feed scenario.
argument-hint: <scenario-name> [count] [interval-seconds]
disable-model-invocation: true
allowed-tools: Bash(bash .claude/skills/capture-feed/capture.sh *)
---

Capture the current NASCAR live feed as a numbered scenario for the backend mock feed.

1. The scenario name is a short folder name describing the state, like `practice`, `qualifying`, `caution` or `red-flag`. If the user didn't give one, ask.
2. From the repo root, run in the background (it can take several minutes):
   `bash .claude/skills/capture-feed/capture.sh $ARGUMENTS`
   Defaults: 10 snapshots, 30 seconds apart.
3. When it finishes, open the first and last files and report `run_type`, `flag_state`, `lap_number` and `series_id`, so the user can confirm the scenario captured what they wanted.
4. For practice or qualifying, note what the `qualifying_status` values looked like (Backend Spec 1.2 asks for this).