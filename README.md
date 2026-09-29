# Parabolica

Parabolica is a real-time racing statistics platform providing driver tracking and performance analytics for NASCAR and Formula 1.

**Project site:** [parabolica.dev](https://parabolica.dev)

## 🏁 Overview

The platform aggregates data from various racing APIs, providing a centralized dashboard for enthusiasts and analysts. It features live polling for real-time race events, historical data storage, caching for performance, and a modern web interface.

## 🚀 Tech Stack

### Backend
- **Framework:** .NET (ASP.NET Core)
- **Data Polling:** Background Services with `HttpClient`
- **Caching:** In-memory caching for live feeds
- **Database:** PostgreSQL, through Entity Framework Core and Npgsql

### Frontend
- **Framework:** Next.js (App Router)
- **Library:** React
- **Styling:** Tailwind CSS
- **Language:** TypeScript

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Hosting (planned):** Cloud hosting behind Cloudflare, managed with Terraform. See [docs/infrastructure-plan.md](docs/infrastructure-plan.md).

Exact versions are set in `app/backend/Parabolica.Api.csproj`, `app/frontend/package.json`, the Dockerfiles, and `docker-compose.yml`. This README names technologies only, so it doesn't go stale ([ADR 0007](docs/adr/0007-2026-09-26-workflow-and-ai-tooling.md), section 3).

## 📁 Project Structure

```text
.
├── .claude/                # Shared Claude Code setup
│   ├── agents/             # Review helpers (code-reviewer, security-auditor)
│   ├── hooks/              # validate-bash.sh: blocks database wipes and terraform apply/destroy
│   ├── rules/              # Backend, frontend, Terraform, and testing rules
│   ├── skills/             # /capture-feed and /import-season
│   └── settings.json       # Shared permissions, hooks, and MCP servers
├── .github/                # Dependabot config and CI/CD workflows (scaffolded)
├── app/
│   ├── backend/            # ASP.NET Core API (Parabolica.Api)
│   │   ├── admin/          # Admin key filter and base controller for secured endpoints
│   │   │   └── import/     # Endpoints and request models for importing historical NASCAR data
│   │   ├── data/           # Entity Framework Core DbContext
│   │   │   └── entities/   # Database models (NascarRaceListBasicYear, NascarWeekendFeed)
│   │   ├── f1/             # F1 logic (planned, empty)
│   │   ├── Migrations/     # EF Core migrations, applied automatically on startup
│   │   ├── nascar/         # NASCAR live feed controller
│   │   │   ├── models/     # Response models for the live, race list, and weekend feeds
│   │   │   └── services/   # API clients, live race detection, caching, and background polling
│   │   ├── Properties/     # Local launch profile
│   │   ├── Dockerfile      # Backend container build
│   │   └── Program.cs      # API configuration and service registration
│   └── frontend/           # Next.js web application
│       ├── app/            # App Router pages, layout, and global styles
│       │   ├── components/ # Reusable UI components (Logo, Modal, ThemeToggle)
│       │   ├── f1/         # F1 pages and race detail routes (placeholder data)
│       │   └── nascar/     # NASCAR live page and race detail routes
│       ├── public/tracks/  # Track map SVGs (see Credits)
│       ├── Dockerfile      # Frontend container build (Next.js + nginx)
│       ├── nginx.conf      # HTTPS, /api proxy to the backend, and static file caching
│       └── start.sh        # Container entrypoint: creates a self-signed cert, starts Next.js and nginx
├── docs/                   # Planning docs: master plan, specs, infrastructure plan, reference, team onboarding
│   └── adr/                # Architecture decision records, one file per decision date
├── scripts/                # Helper scripts (empty)
├── terraform/              # Infrastructure as code (scaffolded)
├── test-data/nascar/live/  # Saved NASCAR live feed sample for testing
├── .env.example            # Environment variables to copy into .env
├── .mcp.json               # Shared MCP servers for Claude Code (Context7, GitHub)
├── CLAUDE.md               # Project instructions for Claude Code
└── docker-compose.yml      # Local orchestration: frontend, backend, and PostgreSQL
```

"Scaffolded" means the files exist but are still empty. For a file-by-file walkthrough, see [Team Onboarding, section 7](docs/team-onboarding.md#7-current-project-structure).

## 🛠️ Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- (Optional) [.NET SDK](https://dotnet.microsoft.com/download), matching the target framework in `app/backend/Parabolica.Api.csproj`
- (Optional) [Node.js](https://nodejs.org/), matching the version in `app/frontend/Dockerfile`

### Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/mbachel/parabolica.git
   cd parabolica
   ```
2. Copy `.env.example` to `.env` and set `POSTGRES_PASSWORD` and `ADMIN__KEY`. The app doesn't use `GITHUB_PAT`; it's for the GitHub MCP server in Claude Code (see [Claude Code](#-claude-code)).
3. Run the following command:
   ```bash
   docker compose up --build
   ```
4. Access the applications. The frontend container creates a self-signed certificate on first start, so your browser will show a warning you need to accept. Requests to `http://localhost` redirect to HTTPS.
   - **Frontend:** [https://localhost](https://localhost)
   - **Backend API:** [https://localhost/api/](https://localhost/api/)
   - **NASCAR Live Feed:** [https://localhost/api/nascar/live](https://localhost/api/nascar/live)

## ✨ Features

- **Live NASCAR Tracking:** Automated polling of official NASCAR feeds with configurable intervals.
- **Historical Data Import:** Secured admin endpoints to import and store historical race lists and weekend feeds in PostgreSQL.
- **Race Snapshots:** Quick view of leaders, status, and lap counts.
- **Multi-Series Support:** Dashboard prepared for both NASCAR and Formula 1 data. NASCAR pages read live data from the backend; F1 pages are scaffolded with placeholder data pending the F1 integration.

## 🛠 Development

### Backend
To run the backend locally without Docker:
```bash
cd app/backend
dotnet run
```

### Frontend
To run the frontend locally in development mode:
```bash
cd app/frontend
npm install
npm run dev
```

### Workflow
- **Tasks:** tracked in Jira, project key `PAR`.
- **Branches:** each developer works on their own branch (`matthew`, `soumil`). Once the repo reorganization (Phase 0) is finished, changes go from a personal branch to `dev` by pull request, then from `dev` to `prod` by pull request. Until then, personal branches merge into `main`. The other developer reviews every pull request.
- **Commit messages:** prefix style (`feat:`, `fix:`, `chore:`, `cleanup:`, `feat!:`) plus the Jira key, for example `fix: PAR-10 use flag 5 for checkered`. Put the key in pull request titles too.
- **Decisions:** recorded in [docs/adr/](docs/adr/). See [Team Onboarding](docs/team-onboarding.md) for how the team works.

### 🤖 Claude Code

The repo ships a shared [Claude Code](https://code.claude.com/docs) setup: `CLAUDE.md` for project instructions, and `.claude/` for rules, skills, agents, and a hook that blocks destructive commands. `.mcp.json` adds two MCP servers:
- **Context7:** current library documentation.
- **GitHub:** reads the repo, issues, and pull requests. It needs a GitHub personal access token in the `GITHUB_PAT` environment variable. Set it in the shell that launches Claude Code; Claude Code doesn't read `.env`.

AI agents may read git but never write to it: no commits, pushes, merges, branches, or pull requests. A person makes every commit ([ADR 0007](docs/adr/0007-2026-09-26-workflow-and-ai-tooling.md), section 2). Personal files (`CLAUDE.local.md`, `.claude/settings.local.json`) are gitignored.

## 📄 License

The source code in this repository is released under the [MIT License](LICENSE).

The track map graphics in `app/frontend/public/tracks/` are **not** covered by the MIT License. They are adapted from Wikimedia Commons originals and remain under their original licenses, listed in the Credits section below. If you reuse this project, keep those attributions and honor the share-alike terms on the CC BY-SA files.

Note that share-alike applies to the track graphics themselves, not to this project's source code. Rendering these images in the application does not make the application a derivative work of them.

## 🙏 Credits

### Track Maps

Track map SVGs in `app/frontend/public/tracks/light/` are adapted from [Wikimedia Commons](https://commons.wikimedia.org/). Each file in this repository has been **modified** from its original, typically by removing elements that do not suit this site's presentation.

| File in this repo | Original | Author | License |
| --- | --- | --- | --- |
| `Atlanta_Motor_Speedway.svg` | [Atlanta Motor Speedway.svg](https://commons.wikimedia.org/wiki/File:Atlanta_Motor_Speedway.svg) | Pitlane02 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `Bristol_Motor_Speedway_2024.svg` | [Bristol Motor Speedway 2024.svg](https://commons.wikimedia.org/wiki/File:Bristol_Motor_Speedway_2024.svg) | Stl66dmk | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `Charlotte_Motor_Speedway_2024.svg` | [Charlotte Motor Speedway 2024.svg](https://commons.wikimedia.org/wiki/File:Charlotte_Motor_Speedway_2024.svg) | Stl66dmk | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `Daytona_International_Speedway_edited.svg` | [Daytona International Speedway.svg](https://commons.wikimedia.org/wiki/File:Daytona_International_Speedway.svg) | Will Pittenger | Public domain |

**Licensing of the modified files.** Each modified CC BY-SA track map in this repository is released under the same license as its original: the Atlanta adaptation under CC BY-SA 3.0, the Bristol and Charlotte adaptations under CC BY-SA 4.0. The Daytona original is public domain, so its adaptation carries no license obligation; the credit above is retained as a courtesy.

When adding a new track map, record the original file, its author, and its license in the table above, and note that the version in this repository has been modified.

### Data Sources

Live and historical NASCAR timing data is retrieved from official NASCAR feeds. This project is an independent, non-commercial work and is not affiliated with, endorsed by, or sponsored by NASCAR, Formula 1, or any racing series, team, or venue.
