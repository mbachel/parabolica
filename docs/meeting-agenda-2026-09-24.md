# Meeting Agenda: Matthew and Soumil

**Thursday, September 24, 2026, 8:30 pm**  
**Goal:** leave with a name, a hosting direction, a tracking tool, a first take on scope, and a task list for next week.

## 1. Where we are

- **The live NASCAR page works locally, but nothing new has been built since May.** Historical results, lap-time charts, F1, and putting the site online are all still ahead.
- **The planning is consolidated.** It was scattered across 11 files and is now 6 documents: Master Plan, Backend Spec, Frontend Spec, Infrastructure Plan, Reference, and Team Onboarding. They're in Drive now and will also go in the repo.
- **DigitalOcean is gone.** It pulled its Student Pack credit on August 1, so there's no free early deploy. The first public version will be the real cloud setup.
- **Good news on lap times.** NASCAR's lap-time data works, so lap-time charts are no longer blocked on data.
- **We need a name first.** Another app already uses "RaceIntel," so the name comes before anything else. The repo reorganization happens at the same time as the rename.
- **Both the frontend and backend need security upgrades.** Next.js has shipped several critical fixes since the version we're on, and our .NET version is missing 48 security fixes.

## 2. Decisions

Numbers match the open decisions in the Master Plan.

| # | Decision | Options | Recommendation in the docs | Decided |
|---|---|---|---|---|
| 1 | Name | RaceIntel, Parabolica, or other ideas. Whatever we pick goes on everything: repo, local folders, domain, and the app | | |
| 2 | Hosting and cost split | Full AWS, full Azure, hybrid, or another provider. See the pricing summary below | All Azure (Container Apps) long-term. One AWS server first if we want AWS experience | |
| 3 | Homepage | A. Status and about us. B. Live NASCAR summary. C. Landing page with links and "coming soon." D. A mix | | |
| 4 | Lap-time charts | Live, historical, or both? What visual? Do the track maps play a part? | | |
| 5 | F1 data | See the F1 options below | | |
| 6 | Tracking tool | See the tracking options below (all free) | Jira Free | |
| 7 | License | Keep MIT, or switch. Options include Apache-2.0, MPL-2.0, GPL-3.0, AGPL-3.0, or a non-commercial license like PolyForm Noncommercial | | |

### Pricing summary

Monthly prices at list rate, US East. The full breakdown with line items is in the Infrastructure Plan, section 1. Cloudflare's free plan sits in front of every option at no cost.

| Setup | Monthly after free credits | First year |
|---|---|---|
| **Full AWS:** containers + load balancer + managed database | $60.61 | $527 to $627 |
| **Full AWS:** containers + Cloudflare Tunnel (no load balancer) | $36.60 | $239 to $339 |
| **Full AWS:** one server running Docker Compose | $17.51 | $0 to $73 |
| **Full AWS:** Lightsail server | $12.00 | $0 to $44 |
| **Full AWS:** Kubernetes (EKS) | $104.59 | $1,055 to $1,155 |
| **Full Azure:** Container Apps + managed database | $26.31 | about $57 |
| **Full Azure:** App Service + managed database | $28.50 | about $137 |
| **Full Azure:** one VM running Docker Compose | $12.18 to $36.42 | about $40 to $67 |
| **Full Azure:** Kubernetes (AKS) | $83.63 | about $687 |
| **Hybrid:** frontend on AWS Amplify, backend on Azure | $28.36 | about $49 |
| **Hybrid:** frontend on Azure, backend on one AWS server | $17.51 | $0 to $73 |
| **Hybrid:** frontend on Cloudflare Workers, backend on Azure | $30.63 | $49 to $109 |
| **Hybrid:** frontend on Cloudflare Workers, backend on one AWS server | $22.51 | $0 to $133 |
| **Other:** Oracle Always Free | $0 | $0 |
| **Other:** Railway | about $6.66 | about $80 |
| **Other:** Fly.io | $11.27 | about $135 |
| **Other:** Render | $14.50 to $21.50 | $174 to $258 |
| **Other:** Heroku (Student Pack covers $13/month) | $21 to $23 | about $96 to $120 |
| **Other:** Google Cloud Run + Cloud SQL | $55.21 | about $497 |

**Frontend on Cloudflare:**

- Needs the Workers Paid plan ($5/month, included above).
- Needs an adapter to run Next.js.
- Cloudflare Pages can't serve Next.js as a server.

### F1 data options

Full table with sources: Backend Spec, section 4.

| Option | Cost | Live? | History | Main limits |
|---|---|---|---|---|
| OpenF1 (free) | Free | No, about 30 min after a session | 2023 on, including car telemetry | 30 requests/min. Non-commercial (CC BY-NC-SA) |
| OpenF1 Sponsor | €9.90/month | Yes, about 3 s behind | Same | 60 requests/min. Non-commercial |
| OpenF1 self-hosted | Hosting cost + F1 TV | Yes, if we record | What we record | Needs an F1 TV token; Python + MongoDB service |
| FastF1 | Free | No | 2018 on, including telemetry | Python only. Data ready 30 to 120 min after a session |
| Jolpica API (replaced Ergast) | Free | No | Results from 1950, lap times from 1996, pit stops from 2011 | 500 requests/hour. Non-commercial |
| Jolpica database dumps | Free (14 days behind); paid tier is current | No | Full history | Free tier non-commercial |
| F1DB | Free | No | Results, pit stops, standings from 1950 | Commercial use OK with credit (CC BY 4.0) |
| TracingInsights datasets | Free | No | Results from 1950, laps from 1996; per-session telemetry | Built from other sources; treat as non-commercial |
| Kaggle F1 dataset | Free | No | 1950 to 2024 | Stops at 2024 |
| Official F1 live timing (UndercutF1 or LiveF1 libraries) | F1 TV: US Access $3.49/month | Yes, real time | What we record | Unofficial, no public terms; personal non-commercial use only; UndercutF1 library is GPL-3.0 |
| API-Sports Formula-1 | Free 100/day; $15 to $35/month | Claims live | About 15 seasons | Commercial product |
| Sportmonks | €69/month | Yes | Laps, pit stops, tyres | Commercial |
| Sportradar | Enterprise pricing | Yes | Current season + 2 previous | Commercial contract |
| Hyprace | $7.99 to $69.99/month | No | Results and stats from the 1950s | No laps or pit data |
| PitStop Data | Free 15/day; $4.99 to $49.99/month | No | Lap and pit data 2024 to 2026 | New, small provider |
| f1api.dev | Free | Live dashboard | Seasons, drivers, teams | Limits and data origin not published |

### Tracking tool options

Every option here has a permanent free plan.

| Tool | Free plan | Sprints and backlog | GitHub link | Claude connection | Industry use |
|---|---|---|---|---|---|
| Jira Free | 10 users, unlimited projects, 2 GB, 100 automation runs/month | Yes (Scrum and Kanban) | Yes (free GitHub for Atlassian app) | Official connector and MCP server. Works on Free per user reports; Atlassian's own docs don't say | Highest |
| Linear Free | Unlimited members, 2 teams, **250 issues max** | Yes (cycles) | Yes (per third-party review) | Official connector and MCP server | Growing, mostly startups |
| GitHub Issues + Projects | Free | Iterations, boards, roadmap | Built in | Official GitHub MCP server | Everyone knows GitHub; Projects itself is less common |
| Azure DevOps Boards | 5 users | Yes | Yes (Azure Boards app) | Official MCP server (local version for Claude) | Common at Microsoft-stack employers |
| YouTrack | 10 users | Yes | Yes (not confirmed on Free) | Official MCP server and connector | Niche |
| Plane | 12 users, no integrations on Free | Yes (cycles) | Probably not on Free | Official MCP server | Niche |
| Trello Free | 10 collaborators, 10 boards | Kanban only | Add-on only | Official MCP server | Low for engineering |
| Asana Personal | **2 users** | Boards only | Not confirmed on Free | Official MCP server | Business teams |
| ClickUp Free | Unlimited members, very little storage | Add-on | Limited | Official MCP, 100 calls/day on Free | Low |
| Notion Free | Nearly unusable with 2+ members (1,000-block cap) | Templates only | Limited | Official MCP server | Low as a tracker |

**Why the docs recommend Jira Free:**

- It's free for our team size.
- It has real sprints and a backlog, which makes assigning work easy.
- It links to GitHub through a free official app, and it has an official Claude connector.
- It's the tracker that shows up most in job postings.

**Limits to know:**

- 100 automation runs a month across the whole site.
- No per-user permissions.
- A Free-plan sign-in bug has been reported with other AI tools. Claude may or may not be affected.

**A common setup:** Jira for sprints and the backlog, with issue keys (like `PROJ-12`) in branch names and pull request titles so work links back to the code.

## 3. Next week

Tasks that fit in one week, not yet assigned. We split them in the meeting.

- **Rename and reorganize (once the name is picked):**
  - Rename the repo, reorganize the folders, and add the CLAUDE.md, .claude/, and .mcp.json starting files.
  - Re-clone and recreate our branches.
- **Set up the tracking tool** and load the rename, reorganization, and live-page tasks.
- **Frontend: upgrade** Next.js, React, Tailwind, and Node to the patched versions.
- **Backend: upgrade** .NET, EF Core, the Npgsql provider, and the PostgreSQL image to the patched versions.
- **Backend: quick fixes:**
  - checkered-flag check
  - Polling Service error recovery and startup delay
  - timeouts and User-Agent
  - `/health`
  - remove CORS
- **Backend: first version of the mock feed** with a few scenarios.
- **Frontend: start splitting the live page into components.** Fix the flag labels and add the series chip.
- **Both: agree the practice and qualifying state names.**
- **Save a real feed sample** into the test data if there's a NASCAR practice or qualifying session that week.

## 4. Scope

Good project-management practice is to write scope down before building. It keeps us agreed on what we're making, stops "one more feature" creep, and gives us a way to handle changes. The documents and statements it usually takes, and what ours could include:

| Document | What it is | Suggested content for us |
|---|---|---|
| Project charter | A one-page "why and what" that both of us sign off on | Purpose (a live and historical racing data site), goals (a working public product, a strong portfolio piece), constraints (free or low-cost tools, a monthly budget ceiling, non-commercial data licenses), who's involved, how we'll judge success |
| Scope statement | The detailed boundary of the project | In-scope and out-of-scope lists (a starting draft is in Team Onboarding, section 3), deliverables per phase, acceptance criteria (the Master Plan's "done" lists), assumptions (NASCAR feeds stay public), constraints |
| Work breakdown structure (WBS) | The deliverables split into small work packages | Phases become epics, spec items become stories or tasks in the tracker |
| Requirements list | Numbered requirements, split into what the site does and how well it has to do it (security, cost, uptime, speed) | Each requirement traced to a WBS item, so we can see why each task exists |
| Definition of done | One checklist every task has to pass | Pull request reviewed, works in Docker Compose, forced views checked where relevant, docs updated |
| Change control | How scope changes get approved | A change needs both of us to agree. It's logged in the Master Plan's decision list, and the scope statement is updated |
| Risk register | What could go wrong and what we'd do | NASCAR changes or blocks its feeds, F1 data access changes, free tiers or credits end, time runs short |

**Suggested for this meeting:**

- Agree to write a one-page charter and a scope statement from the drafts we already have.
- Set a monthly budget ceiling.
- Agree on the change-control rule.

## 5. Questions

- When can we meet in October? One or two meetings.
- Anything in the docs that's wrong or missing?
