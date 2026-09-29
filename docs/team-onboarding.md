# Team Onboarding

**Project:** Live Racing Data Platform (working name until the name is decided)  
**Last updated:** 2026-09-23

## 1. What this project is

A motorsports analytics site. It follows NASCAR sessions live and will let you browse past races, with lap-time charts and F1 coming later. It's open source and non-commercial. We're building it as a real long-term product, not just a portfolio piece. NASCAR comes first; F1 is next. IndyCar, WEC, and IMSA are ideas for later, not plans.

## 2. What's built (plain English)

- The backend checks NASCAR's live feed on a schedule and works out what's happening: no session, pre-race, racing, or finished.
- The live NASCAR page shows the running order, flags, and race stats from that feed.
- An admin-only import can pull any past race or season from NASCAR and save it.
- Everything runs locally in Docker: website, backend, database.
- Track maps for Atlanta, Bristol, Charlotte, and Daytona.

Nothing is online yet. The last code change was May 17, 2026.

## 3. Scope

These lists match the phases in the Master Plan. Formal scope documents are on the 9/24 agenda; update this section once they're agreed.

**In scope now**

- **Phase 0:** rename the project and reorganize the repo (section 6).
- **Phase 1:** make the live NASCAR page correct and clean. That covers:
  - current, patched versions for the frontend, backend, and database
  - all flags, plus practice and qualifying
  - forced test views
  - the homepage
  - code split into components
- **Phase 2:** browse past NASCAR races, then lap-time charts.
- **Phase 3:** put it on the cloud behind Cloudflare, with automated deploys and monitoring. One production environment.
- **Phase 4:** F1, once a data source is chosen.

Details and status: Master Plan.

**Not in scope**

- User accounts or logins
- Ads, paid tiers, or any money-making. Most free F1 data licenses forbid commercial use
- A separate mobile design (Tailwind's responsive defaults are the bar for now)
- Other series beyond NASCAR and F1
- Extra cloud environments (dev or staging). Testing stays local in Docker Compose
- Running in several regions, or autoscaling. Overkill and costly at our size

## 4. Where things live

| What | Where |
|---|---|
| Planning docs | Google Drive (.docx), Parabolica folder. After the reorganization, .md copies go in the repo's `docs/` folder. Old docs are in Parabolica/Old/ |
| Code | https://github.com/mbachel/race-intel (to be renamed with the project) |
| Tasks | GitHub Issues today. The tracking tool is an open decision (Master Plan, open decision 6) |

## 5. How we work

- **Branches:**
  - Each of us develops on our own branch (`matthew`, `soumil`), made from the latest `main`.
  - To merge, open a pull request into `main`; the other person reviews it before it goes in.
- **Commit messages:** keep the current style: `feat:`, `fix:`, `chore:`, `cleanup:`.
- **Never commit secrets.** `.env` is gitignored; `.env.example` shows what's needed.
- **Testing:** everything is tested through Docker Compose, so frontend, backend, and a sample database run together.
- **Tasks:** name them for the action ("Fix checkered flag check," not "Backend stuff"). Only track real, open work.

## 6. Project structure and reorganization

The target layout follows two reference layouts: a standard "code + CI/CD + Terraform" project, and the Claude Code project layout. The reorganization happens together with the rename, before Phase 1 (Master Plan, Phase 0).

This section is the plan. For what the repo actually contains today, see section 7.

### 6.1 Target layout

```
<project-name>/
├── .github/
│   ├── dependabot.yml
│   └── workflows/            ci.yml, cd-backend.yml, cd-frontend.yml,
│                             terraform-plan.yml, terraform-apply.yml
├── .claude/                  Claude Code setup (section 6.3)
│   ├── settings.json
│   ├── settings.local.json   personal, not committed
│   ├── rules/
│   ├── skills/
│   ├── agents/
│   └── hooks/
├── app/
│   ├── backend/              C# API (today's backend/), with its Dockerfile and .dockerignore
│   └── frontend/             Next.js (today's frontend/), with its Dockerfile, .dockerignore,
│                             nginx.conf, start.sh, and test-data/views/ for forced views
├── terraform/
│   ├── main.tf, variables.tf, outputs.tf, providers.tf, backend.tf
│   ├── bootstrap/            one-time setup of Terraform state storage
│   ├── environments/
│   │   └── prod/             production values only
│   └── modules/              network, registry, database, app, secrets, cloudflare, monitoring
├── scripts/                  helper scripts (for example, importing seasons or saving a live feed sample)
├── test-data/
│   └── nascar/
│       ├── live/             saved feed scenarios for the backend mock feed
│       └── lap-times/        saved lap-time responses
├── docs/                     .md copies of the planning docs, plus architecture.svg
├── CLAUDE.md                 project instructions for Claude Code
├── CLAUDE.local.md           personal, not committed
├── .mcp.json                 shared MCP server setup
├── docker-compose.yml
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

### 6.2 Where this differs from the reference layouts, and why

- **No `k8s/` folder.** Kubernetes is only priced as an option. Add the folder if a Kubernetes option is chosen.
- **`.gitignore` stays at the root, and each `.dockerignore` sits next to its Dockerfile.** One reference layout puts both in `scripts/`, but they don't work there:
  - a `.gitignore` only covers its own folder and below
  - Docker only reads `.dockerignore` from the root of each build folder
- **Only `environments/prod/`.** There is one environment; the folder leaves room for more later.
- **`bootstrap/` is added.** Terraform needs somewhere to store its state before it can manage anything else. That storage gets created once, by hand.
- **Suggested: five workflow files instead of one `ci-cd.yml`,** so backend, frontend, and infrastructure changes each run only their own pipeline. One combined file also works.
- **Suggested: `.claude/skills/` instead of `.claude/commands/`.** Claude Code merged custom commands into skills; skills are the current format. Files in `commands/` still work if we'd rather keep that folder too.
- **`test-data/` and `docs/` are added** for the forced-view testing and the planning docs.

### 6.3 Claude Code setup (suggested starting files)

These are suggestions to agree on, not final. What's committed is shared; "personal" files stay on each machine.

| File or folder | Committed? | What it's for | Suggested starting content |
|---|---|---|---|
| `CLAUDE.md` | Yes | Instructions Claude Code loads at the start of every session | Project summary, stack and versions, the layout above, how to run and test (Docker Compose), conventions (commit style, 300-line file limit, relative `/api` paths, never commit secrets). Keep it under 200 lines. Point to `docs/` files by path instead of importing them with `@`, because imported files load into every session and use up context |
| `CLAUDE.local.md` | No (add to `.gitignore`) | Personal notes for Claude on your machine | Anything personal, like local ports or shortcuts |
| `.mcp.json` | Yes | MCP servers everyone shares | Context7 and GitHub MCP. Later, the tracking tool's MCP server. Tokens are never written in the file. They're read from environment variables with `${VARIABLE_NAME}` |
| `.claude/settings.json` | Yes | Shared permissions, hooks, and plugins | Deny rules: `Read(./.env)` and `Bash(terraform apply *)`. Not `Read(./.env.*)`, which would also hide `.env.example`. The hook from the `hooks/` row below. The shared plugins (Superpowers, UI/UX Pro Max) listed under `enabledPlugins` and `extraKnownMarketplaces`, so both machines get the same ones after trusting the folder |
| `.claude/settings.local.json` | No | Personal permission overrides | Claude Code keeps it out of git automatically when it creates the file. Add it to `.gitignore` too, in case one gets created by hand |
| `.claude/rules/` | Yes | Topic rule files; a `paths:` list at the top makes a rule load only when Claude works on matching files | `backend.md` (paths `app/backend/**`: C# conventions), `frontend.md` (paths `app/frontend/**`: Next.js conventions, 300-line limit, relative API paths), `terraform.md` (paths `terraform/**`: never apply, no secrets in state), `testing.md` (always loaded: Docker Compose, mock feed, forced views) |
| `.claude/skills/` | Yes | Repeatable workflows; the folder name becomes the slash command | `import-season` (load a NASCAR season through the admin import), `capture-feed` (save the current live feed into `test-data/` as a scenario) |
| `.claude/agents/` | Yes | Specialized helpers with their own context and a limited tool set (`name` and `description` are required at the top of each file) | `code-reviewer.md` (read-only tools, reviews a change before a pull request), `security-auditor.md` (checks secrets, CORS, Cloudflare and admin-endpoint exposure) |
| `.claude/hooks/` | Yes (the scripts) | Scripts that run before or after Claude uses a tool; configured in `settings.json` | `validate-bash.sh`, run before every shell command. It blocks commands that wipe the local database (`docker compose down -v`, `docker volume rm`) or change cloud infrastructure (`terraform apply`, `terraform destroy`). A hook blocks a command by exiting with code 2 |

### 6.4 Reorganization steps (Phase 0)

1. **Pick the name** (Master Plan, open decision 1).
2. **Rename the GitHub repo.** Rename everything else that carries the name too, so nothing is mixed:
   - the domain
   - the page title and app text
   - `package.json` name
   - the C# project and namespaces (`RaceIntel.Api`)
   - the database context (`RaceIntelDbContext`) and database name (`RaceIntelDb`)
3. **Move the code on a branch:**
   - `git mv backend app/backend` and `git mv frontend app/frontend`
   - Update `docker-compose.yml` build paths, the `.gitignore` entries that mention `frontend/`, and README paths.
4. **Add the new folders and files** from 6.1:
   - `terraform/` skeleton, `scripts/`, `test-data/`, `docs/`
   - `.claude/`, `CLAUDE.md`, `.mcp.json`
   - `.github/dependabot.yml`
   - Copy the Feb 22 `live-feed.json` sample into `test-data/nascar/live/pre-race/`.
5. **Test:** `docker compose up --build` works from a fresh clone.
6. **Merge into `main`.**
7. **Re-clone and branch.** Everyone deletes their local copy, re-clones the renamed repo so the local folder has the new name, and makes their branch from `main`.

## 7. Current project structure

This is the repo as it stands after the move into `app/`. Items marked *scaffolded* exist but are still empty. Items from the target layout (6.1) that don't exist yet are listed in 7.5.

### 7.1 Top level

| Path | What it's for |
|---|---|
| `.claude/settings.json` | Shared Claude Code permissions, hooks, and plugins. *Scaffolded.* Planned contents are in 6.3 |
| `.github/dependabot.yml` | Automatic dependency update pull requests. *Scaffolded* |
| `.github/workflows/` | `ci.yml`, `cd-backend.yml`, `cd-frontend.yml`, `terraform-plan.yml`, `terraform-apply.yml`. *All scaffolded* |
| `app/backend/` | The C# API (section 7.2) |
| `app/frontend/` | The Next.js website (section 7.3) |
| `docs/` | The planning docs: Master Plan, Backend Spec, Frontend Spec, Infrastructure Plan, Reference, this onboarding guide, and meeting agendas |
| `scripts/` | Helper scripts. Empty for now (holds a `.gitkeep`) |
| `terraform/main.tf` | Cloud infrastructure as code. *Scaffolded* |
| `test-data/nascar/live/live-feed.json` | A saved copy of NASCAR's live feed, for testing without a live session |
| `.env.example` | The variables `.env` needs: `POSTGRES_PASSWORD` and `ADMIN__KEY` |
| `.mcp.json` | Shared MCP servers for Claude Code. *Scaffolded* |
| `CLAUDE.md` | Project instructions for Claude Code. *Scaffolded* |
| `docker-compose.yml` | Runs the three containers locally: `frontend`, `backend`, and `db` (PostgreSQL 17) |
| `.gitignore`, `LICENSE`, `README.md` | Git ignore rules, MIT license, project overview |

### 7.2 Backend (`app/backend/`)

An ASP.NET Core API on .NET 10. The project is `Parabolica.Api`, and namespaces follow the folders (for example `Parabolica.Api.Nascar.Services`).

| Path | What it's for |
|---|---|
| `Program.cs` | Registers services, applies database migrations on startup, turns on CORS, and maps the controllers |
| `Parabolica.Api.csproj` | Project file: target framework (`net10.0`) and NuGet packages (EF Core, Npgsql for PostgreSQL, OpenAPI) |
| `Parabolica.Api.http` | Sample request for `GET /api/nascar/live`, runnable from VS Code or Visual Studio |
| `appsettings.json`, `appsettings.Development.json` | Logging settings. The database connection string and admin key come from environment variables set in `docker-compose.yml` |
| `Properties/launchSettings.json` | Local `dotnet run` profile (http://localhost:8080) |
| `Dockerfile`, `.dockerignore` | Builds the API container, which listens on port 8080 |
| `admin/AdminKeyAuthFilter.cs` | Rejects requests whose `X-Admin-Key` header doesn't match the configured admin key |
| `admin/AdminControllerBase.cs` | Base class for admin controllers. Applies the admin key filter to every controller that inherits from it |
| `admin/import/NascarImportController.cs` | `POST /api/admin/import/nascar/race-list-basic` (a season's race list) and `POST /api/admin/import/nascar/weekend-feed` (one race weekend). Saves the results to the database |
| `admin/import/*Request.cs` | Request bodies for the two import endpoints |
| `data/ParabolicaDbContext.cs` | Entity Framework Core database context |
| `data/entities/` | Database tables: `NascarRaceListBasicYear` (race list per season) and `NascarWeekendFeed` (weekend feed per race) |
| `Migrations/` | EF Core migrations. Generated with the `dotnet ef` tools; don't edit by hand |
| `nascar/NascarController.cs` | `GET /api/nascar/live`: returns the latest cached live feed |
| `nascar/models/` | Classes that match NASCAR's JSON: live feed, race list, and weekend feed |
| `nascar/services/NascarApiClient.cs` | Fetches NASCAR's live feed |
| `nascar/services/NascarHistoricalApiClient.cs` | Fetches a season's race list and a race's weekend feed |
| `nascar/services/NascarLiveRaceDetector.cs` | Watches the live feed and works out the race state (unknown, no race, pre-race, active, post-race) and how long to wait before the next check |
| `nascar/services/NascarCacheService.cs` | Holds the latest live feed in memory so the API can answer quickly |
| `nascar/services/NascarPollingService.cs` | Background loop that asks the detector for the race state, caches any feed it gets back, and waits the detector's delay before checking again |
| `f1/` | F1 logic, not started. Holds a `.gitkeep` |

### 7.3 Frontend (`app/frontend/`)

A Next.js 16 site using the App Router, React 19, Tailwind CSS 4, and TypeScript. Each folder under `app/` is a URL route.

| Path | What it's for |
|---|---|
| `app/layout.tsx` | Shared page shell: header with logo, navigation, and theme toggle; footer; fonts; page title |
| `app/page.tsx` | Homepage (`/`). Currently shows placeholder numbers |
| `app/globals.css` | Global styles and theme colors |
| `app/components/` | Reusable pieces: `Logo`, `Modal`, `ThemeToggle` (saves the light or dark choice in the browser) |
| `app/nascar/page.tsx` | Live NASCAR page (`/nascar`). Reads `/api/nascar/live` from the backend |
| `app/nascar/[race]/page.tsx` | NASCAR race detail page (`/nascar/<race>`). Placeholder data |
| `app/f1/page.tsx`, `app/f1/[race]/page.tsx` | F1 pages (`/f1`, `/f1/<race>`). Placeholder data until the F1 data source is chosen |
| `public/tracks/light/` | Track map SVGs. Their licenses and credits are in the README |
| `package.json`, `package-lock.json` | npm dependencies and scripts (`dev`, `build`, `start`, `lint`) |
| `next.config.ts` | Next.js settings. `output: "standalone"` produces the small server the container runs |
| `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next-env.d.ts` | TypeScript, lint, and Tailwind/PostCSS setup |
| `Dockerfile`, `.dockerignore` | Builds the site, then packages it with nginx in one container |
| `nginx.conf` | Redirects HTTP to HTTPS, forwards `/api/` to the backend, serves static files, and passes everything else to Next.js |
| `start.sh` | Container start script. Creates a self-signed certificate if none exists, starts Next.js, then starts nginx |

### 7.4 Not committed

These live only on your machine and are covered by `.gitignore`:

- `.env`: your real passwords and keys
- `CLAUDE.local.md`, `.claude/settings.local.json`: personal Claude Code settings
- `.vscode/`: editor settings
- Build output: `node_modules/`, `.next/`, `bin/`, `obj/`

### 7.5 Still to add from the target layout

- `.claude/rules/`, `.claude/skills/`, `.claude/agents/`, `.claude/hooks/` (6.3)
- The rest of `terraform/`: `variables.tf`, `outputs.tf`, `providers.tf`, `backend.tf`, `bootstrap/`, `environments/prod/`, `modules/`
- `test-data/nascar/lap-times/`, and the feed scenarios under `test-data/nascar/live/`
- `test-data/views/` in `app/frontend/` for forced views
- `docs/architecture.svg`

## 8. Running it locally

1. Install Docker Desktop.
2. Clone the repo and copy `.env.example` to `.env`. Set `POSTGRES_PASSWORD` and `ADMIN__KEY` to any strong values.
3. Run `docker compose up --build`.
4. Open https://localhost. The frontend container's `start.sh` creates a self-signed certificate on first start, so accept the browser warning.
5. Optional, to load past races: `POST /api/admin/import/nascar/race-list-basic` with body `{ "year": 2026 }` and header `X-Admin-Key: <your key>`.

Once the backend mock feed (Backend Spec 1.10) and the frontend view override (Frontend Spec 1.5) exist, the Compose setup turns both on, and the live page can be forced into any session.

## 9. AI tooling setup

Both machines should run the same tools, so a plan built on one machine builds the same way on the other. These commands are from June 2026; check each project's README before installing.

**The tools**

- **Superpowers:** workflow engine for agent builds (plan, build, review). Needs tmux.
  - `/plugin marketplace add obra/superpowers-marketplace`
  - then `/plugin install superpowers@superpowers-marketplace`
- **UI/UX Pro Max:** frontend design help (charts, dark mode, accessibility). Needs python3.
  - `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill`
  - then `/plugin install ui-ux-pro-max@ui-ux-pro-max-skill`
- **Context7 (MCP):** pulls current, version-correct docs into the agent. We're on Next.js 16, not 15.
  - `claude mcp add context7 -- npx -y @upstash/context7-mcp@latest`
- **GitHub MCP:** lets the agent read the repo, issues, and pull requests. Needs a personal access token with minimal repo scope. Setup: https://github.com/github/github-mcp-server
- **Postgres MCP (optional, later):** point it only at the local Docker database, with read-only credentials. Never at production.

MCP (Model Context Protocol) is the standard that lets the agent talk to outside tools. Once `.mcp.json` and `.claude/settings.json` exist (section 6.3), the shared MCP servers and plugins come with the repo.

**Rules**

- Install Superpowers and UI/UX Pro Max globally so sub-agents inherit them.
- Pin the same versions on both machines.
- Design tasks go to UI/UX Pro Max. Data and logic tasks use test-first development.
- Agents may write Terraform; only a person runs `terraform apply`.

## Sources

- Claude Code project memory, CLAUDE.md, CLAUDE.local.md, rules: https://code.claude.com/docs/en/memory
- Claude Code settings, permissions, plugins: https://code.claude.com/docs/en/settings
- Skills (commands merged into skills): https://code.claude.com/docs/en/skills
- Subagents: https://code.claude.com/docs/en/sub-agents
- Hooks: https://code.claude.com/docs/en/hooks
- MCP and `.mcp.json`: https://code.claude.com/docs/en/mcp
