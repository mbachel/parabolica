# Master Plan

**Project:** Live Racing Data Platform (working name until the name is decided)  
**Repo:** https://github.com/mbachel/race-intel (to be renamed with the project)  
**Last updated:** 2026-09-23

This is the only document that tracks status. The other five explain *how* to do the work; this one says *where things stand* and *what's decided*.

## How the documents fit together

| Document | What it covers | Replaces |
|---|---|---|
| Master Plan | Phases, status, done criteria, decisions, open questions | race-intel-master.md, Race Intel Project Phases & Scope, planning-race-intel.md (sections 0 and 4) |
| Backend Spec | All C# work: live fixes, test mock feed, historical API, lap-time import, F1 data options | race-intel-backend.md, backend half of plan-live-audit.md, planning-race-intel.md (sections 1.1, 2.3, 2.4) |
| Frontend Spec | All Next.js work: upgrades, live page, forced test views, homepage, historical pages, charts | race-intel-frontend.md, frontend half of plan-live-audit.md, planning-race-intel.md (sections 1.2, 2.5, 2.6) |
| Infrastructure Plan | Hosting options and full pricing, Cloudflare, Terraform, CI/CD, secrets, monitoring, security | race-intel-devops.md, planning-race-intel.md (section 3) |
| Reference | Glossary, flag and session tables, data sources, decision records, licenses | CONTEXT.md, 0001-core-stack.md, 0002-historical-elt-raw-json.md |
| Team Onboarding | What's built, scope, how we work, project structure and Claude Code setup, tooling, running locally | HANDOFF-tooling-setup.md |

- **Where the docs live:** Google Drive holds the .docx copies. After the reorganization, the .md copies live in the repo's `docs/` folder so Claude Code can read them.
- **Old documents:** they stay in Drive under Parabolica/Old/ for history. Don't edit them.
- **planning-race-intel.md:** this one only exists in the Claude project. It still has the most detailed Terraform and GitHub Actions drafts, so keep a copy in Old.

## Where things stand

Checked against the repo on 2026-09-23. The last code change was May 17, 2026 (red flag fix). The September 18 commits only updated the README (license and credits), removed unused images, and renamed the Daytona track file.

**Built and working locally**

- Live NASCAR polling service, race-state detector, and `GET /api/nascar/live`
- Admin import endpoints for Weekend Feed and Race List Basic, stored as raw JSON in Postgres
- Docker Compose: nginx + Next.js, .NET backend, Postgres 17, with database migrations applied at startup
- NASCAR live page connected to the backend
- Track SVGs for Atlanta, Bristol, Charlotte, and Daytona, with license credits in the README
- A red flag no longer ends a race early

**Not started:** everything in the phase table below.

## Phases

Renumbered 2026-09-23. The DigitalOcean deploy is gone (DigitalOcean withdrew its Student Pack credit on August 1, 2026) and there is no early public deploy. The first public release is the full cloud build.

Old to new:

- Phase 1 stays Phase 1.
- Old Phase 3 (historical) is now Phase 2.
- Old Phase 5 (lap charts) is now 2C.
- Old Phase 4 (AWS, CI/CD, observability) is now Phase 3.
- F1 is now Phase 4.
- Phase 0 (rename and reorganize) is new.

| Phase | Work | Status | Details |
|---|---|---|---|
| 0 | Rename the project and reorganize the repo | Not started. Waits on the name (open decision 1) | Team Onboarding, section 6 |
| 1A | Live audit: backend, including version upgrades and the test mock feed | Not started | Backend Spec, section 1 |
| 1B | Live audit: frontend, including version upgrades and forced test views | Not started | Frontend Spec, section 1 |
| 2A | Historical v1: backend | Not started. Data shapes need agreement (open decision 8) | Backend Spec, section 2 |
| 2B | Historical v1: frontend | Blocked until the 2A data shapes are agreed | Frontend Spec, section 2 |
| 2C | Lap-time charts | Needs a design decision (open decision 4). Data source confirmed working | Backend Spec, section 3; Frontend Spec, section 3 |
| 3 | Cloud deployment (first public release) | Not started. Hosting choice pending (open decision 2) | Infrastructure Plan |
| 4A | F1 historical | Not started. Data source pending (open decision 5) | Backend Spec, section 4 |
| 4B | F1 live | Not started. Data source pending (open decision 5) | Backend Spec, section 4 |

**Order of work**

- Phase 0 comes first, so everyone starts from the same renamed, reorganized repo.
- 1A and 1B run in parallel.
- Phase 3 groundwork (Terraform, CI) doesn't depend on any feature, so it can start any time.
- The first public deploy needs these items from 1A: `/health`, CORS removed, production settings, and the mock feed switched off.
- The original plan recommended interleaving infrastructure with feature work rather than leaving it to the end. That still holds.

## What "done" means

**Phase 0: Rename and reorganize**

- GitHub repo, local folders, domain, and in-app name all use the chosen name. No mixing.
- Repo matches the structure in Team Onboarding, section 6.
- Everyone re-cloned and working from the new `main`.

**Phase 1: Live audit**

- Frontend, backend, and database on current, patched versions (Frontend Spec 1.1, Backend Spec 1.11)
- Every flag state (0 to 9) and run type (practice, qualifying, race) handled correctly in both backend and frontend
- The live page shows the right view for: no session, hot track, practice, qualifying, pre-race, race under each flag, post-race, practice over, qualifying over
- Every one of those views can be forced for testing, through the backend mock feed and the frontend view override
- Series name shown on every live view
- Live page split into components, no file over 300 lines
- Homepage shows real information, per the homepage decision (open decision 3). No made-up numbers
- Fake sidebar links and F1 mock data removed; unfinished pages show a clean "coming soon"
- `/health` returns 200
- The Polling Service survives errors without taking the backend down

**Phase 2: Historical**

- Season, then race list, then race detail browsing works for the Cup Series
- Weekend Feed and Race List Basic imported for 2024, 2025, and 2026
- Historical reads cached (1 hour for lists, 24 hours for race detail)
- Imports stay admin-only
- 2C: the agreed lap-time visualization works for at least one full race

**Phase 3: Cloud deployment**

- All infrastructure defined in Terraform under `terraform/`
- App reachable at the production domain through Cloudflare, and the origin can't be reached directly
- GitHub Actions runs CI on every pull request and deploys on merge to prod
- GitHub logs into the cloud without stored keys (OIDC)
- Infrastructure changes need a human approval
- One monitoring dashboard and one alert
- README covers both local and cloud deployment

**Phase 4: F1.** Criteria written once the F1 data source is decided (open decision 5).

**Portfolio bar** (from the original plan): a README with setup steps, an architecture diagram at `docs/architecture.svg`, and a working demo URL with a short walkthrough video.

## Decisions made

| Decision | When | Recorded in |
|---|---|---|
| .NET 10 backend, Next.js frontend, PostgreSQL | Early 2026 | Reference, ADR 0001 |
| Store NASCAR JSON as-is; pull fields out when reading | Early 2026 | Reference, ADR 0002 |
| Next.js runs as a server (standalone), not a static export. Hosting options that need a change here are covered in the pricing (open decision 2) | Feb 2026 | Reference, ADR 0001 |
| Historical imports are admin-only (X-Admin-Key header) | Feb 2026 | Backend Spec |
| Components work across series where feasible | June 2026 | Frontend Spec |
| DigitalOcean dropped; no early public deploy | 2026-09-23 | This document |
| Deploy to AWS and/or Azure, chosen by cost. Replaces "AWS over Azure" | 2026-09-23 | Infrastructure Plan |
| One cloud environment (production). Testing stays local in Docker Compose | 2026-09-23 | Infrastructure Plan |
| Kubernetes is priced as a hosting option; no `k8s/` folder unless it's chosen | 2026-09-23 | Infrastructure Plan |
| Cloudflare in front of production with the strictest practical security settings | 2026-09-23 | Infrastructure Plan |
| All testing runs through Docker Compose, so frontend, backend, and a sample database run together | 2026-09-23 | Frontend Spec |
| Views can be forced for testing two ways: backend mock feed and frontend view override, both off in production | 2026-09-23 | Backend Spec 1.10, Frontend Spec 1.5 |
| Phase 1 includes upgrading the frontend, backend, and database to current, patched versions | 2026-09-24 | Frontend Spec 1.1, Backend Spec 1.11 |
| Repo reorganized into `app/backend`, `app/frontend`, `terraform/`, `scripts/`, `docs/`, `.claude/`, done with the rename before Phase 1 | 2026-09-23 | Team Onboarding, section 6 |
| Docs live in Google Drive as .docx, with .md copies in the repo's `docs/` folder | 2026-09-23 | This document |

## Open decisions

| # | Question | When | Notes |
|---|---|---|---|
| 1 | Name: RaceIntel, Parabolica, or another idea | Discuss 9/24 | Everything uses the chosen name: GitHub repo, local repo folders, domain, and the app itself. No mixing of names. Another app already uses "RaceIntel." The Student Pack includes free domains (Name.com, .tech, .me) |
| 2 | Hosting: which cloud setup (AWS, Azure, hybrid, or another option), including where the frontend runs, and how the cost is split | Discuss 9/24 | Full pricing in Infrastructure Plan, section 1 |
| 3 | Homepage: what it shows and looks like | Discuss 9/24 | Options in Frontend Spec 1.6 |
| 4 | Lap-time charts: live, historical, or both? What visual? How do the track SVG maps fit in? | Discuss 9/24 | Data endpoint confirmed. The earlier "Recharts line chart" idea is not decided |
| 5 | F1 data: which source(s), live or historical only, paid or free | Discuss 9/24 | All options with limits in Backend Spec, section 4 |
| 6 | Project tracking tool (must be free) | Discuss 9/24 | Options in the 9/24 agenda. GitHub Issues is what exists today |
| 7 | Project license: keep MIT or switch | Discuss 9/24 | Options to be discussed. Using a GPL library (UndercutF1.Data) would affect this |
| 8 | Historical data shapes (what the backend sends the frontend) | Before 2B starts | Draft in Backend Spec, section 2.3 |
| 9 | Lap-time storage: raw JSON per race, or a lap table | Before 2C starts | Trade-offs in Backend Spec, section 3 |

## Housekeeping

- **Sync the tracker:** once these docs are final, sync the task tracker (GitHub Issues today, or whichever tool open decision 6 picks) to the phase table.
- **Branches after the rename:**
  - Delete the local repo copies.
  - Re-clone the renamed remote so local folder names match.
  - Start from `main`, then recreate the `matthew` and `soumil` branches from it.
  - This also fixes the current `soumil` branch, which is 7 commits behind `main`.
