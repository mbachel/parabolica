# Architecture decision records

One file per day decisions were made. Each decision inside a file has its own status. A later decision that replaces an earlier one names it, and the earlier one is marked Superseded.

| File | Date | Decisions |
|---|---|---|
| [0001](0001-early-2026-core-stack-and-storage.md) | Early 2026 | Core stack; NASCAR data stored as raw JSON |
| [0002](0002-2026-02-nextjs-server-and-admin-imports.md) | February 2026 | Next.js runs as a server; imports are admin-only |
| [0003](0003-2026-06-cross-series-components.md) | June 2026 | Shared components work across series |
| [0004](0004-2026-09-23-planning-consolidation.md) | 2026-09-23 | DigitalOcean dropped; one cloud environment; Docker Compose testing; forced views; Kubernetes only priced; Cloudflare in front; Phase 3 requirements; repo layout; docs location; phases renumbered; scope and conventions; Infrastructure Plan recommendations (Proposed) |
| [0005](0005-2026-09-24-team-meeting.md) | 2026-09-24 | Name Parabolica; Azure Container Apps (Proposed); race line charts; F1 live-timing stream; Jira; keep MIT; Phase 1 upgrades |
| [0006](0006-2026-09-25-jira-and-rename.md) | 2026-09-25 | Jira Scrum setup; GitHub linked by work item key; parabolica.dev; how the rename was done; how Claude Code work is run |
| [0007](0007-2026-09-26-workflow-and-ai-tooling.md) | 2026-09-26 | Branch flow personal, dev, prod; git read-only for AI agents; no versions in Markdown; lowercase backend folders; homelab isn't a host; Claude Code setup (plugins Proposed); ADRs by date |

## Proposed (not yet accepted)

- Hosting on Azure Container Apps (0005, section 2)
- Infrastructure Plan recommendations (0004, section 13)
- Claude Code plugins (0007, section 6)

## Superseded

- Deploy to AWS and/or Azure by cost (0004, section 2), by 0005, section 2 once accepted
- Branch per developer merging into `main` (0004, section 12), by 0007, section 1
- Jira key in branch names (0006, section 2), by 0007, section 1

## Still open (Master Plan)

- Homepage content (open decision 3)
- What race line charts show (open decision 4)
- Historical data shapes (open decision 8)
- Lap-time storage (open decision 9)
