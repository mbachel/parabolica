# 0006: Jira setup and carrying out the rename

**Decided:** 2026-09-25
**Sources:** jira-setup.md (Drive Markdown folder); Jira space PAR; rename task in Jira

## 1. Jira is set up as a Scrum space with sprints

**Status:** Accepted

**Decision:**
- Space `Parabolica`, key `PAR`, at parabolica.atlassian.net. It was recreated as a Scrum space after the first Kanban space was deleted.
- Work runs in sprints. Sprint 1 ("Get back to Square 1") runs 2026-09-25 to 2026-09-28 and holds the list from the 2026-09-24 meeting.
- One epic per Master Plan phase being worked on. So far: Phase 0, Phase 1A and Phase 1B.
- Work types: Epic (a phase), Story (something a visitor would notice), Task (technical work a visitor wouldn't see), Bug (something broken).
- Area labels on each work item: `backend`, `frontend`, `infra`, `docs`.
- Each work item points to its spec section instead of copying it, so the spec stays the one source.

**Why:** Sprints give a backlog plus a time-boxed list, which fits how we plan: agree a week's list in a meeting, then do it. Plain Kanban fits better once a live site produces a steady trickle of bugs.

**Not yet done:** An "In Review" column between In Progress and Done is planned, so pull requests waiting on the other person don't hide in In Progress.

## 2. GitHub is linked to Jira by work item key

**Status:** Accepted (the branch-name part is superseded by 0007, section 1)

**Decision:** The free GitHub for Jira app connects the repo to the Jira site. The work item key (for example `PAR-12`, case-sensitive) goes in commit messages and pull request titles, so they show up in each work item's Development panel. Smart commits are optional and only work when the commit email matches the Atlassian account email.

**Superseded part:** jira-setup.md also put the key in branch names. Personal branches replaced that (0007, section 1).

## 3. Domain: parabolica.dev

**Status:** Accepted

**Decision:** The project's domain is parabolica.dev.

## 4. How the rename was carried out

**Status:** Accepted (merged into `main` on 2026-09-26)

**Decision:** Everything that carried the old name uses Parabolica:
- the C# project and namespaces (`Parabolica.Api`)
- the database context and database name (`ParabolicaDbContext`, `ParabolicaDb`)
- the Docker Compose project name (`parabolica`)
- the npm package name, page title and app text
- the browser storage key for the theme setting

The homepage tagline "Unified race intelligence" stays on purpose. It's a description, not the old name.

**Consequences:** Renaming the Compose project gave the local database a new, empty volume. The old local stack held no rows, so no data was migrated.

## 5. How Claude Code work is run

**Status:** Accepted

**Decision:** Claude Code prompts are written to be pasted in as-is, run in phases, and stop for review after each phase. A person makes the commits. 0007, section 2 turns the second part into a hard rule.
