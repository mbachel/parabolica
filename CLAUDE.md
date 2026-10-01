# Parabolica

Open-source, non-commercial motorsports analytics site. NASCAR live timing today; historical races, lap-time charts, then F1 later. Two developers: Matthew (backend, infra) and Soumil (frontend, data). Domain: parabolica.dev.

## Stack
| Part | Tech |
|---|---|
| Backend | .NET, ASP.NET Core Web API, EF Core + Npgsql (`app/backend`, project `Parabolica.Api`) |
| Frontend | Next.js (App Router, standalone server), React, Tailwind CSS, TypeScript (`app/frontend`) |
| Database | PostgreSQL |
| Local | Docker Compose: nginx + Next.js, backend, Postgres |
| Hosting (Phase 3) | Azure (likely Container Apps) behind Cloudflare; Terraform in `terraform/` |
| Tracking | Jira, project key `PAR` |

Check exact versions in `app/frontend/package.json` and `app/backend/Parabolica.Api.csproj`, not here.

## Layout
```
app/backend/   C# API. Folders lowercase (admin, data, nascar) except Migrations/ and Properties/
app/frontend/  Next.js app, nginx.conf, start.sh
terraform/     Infrastructure (Phase 3)
scripts/       Helper scripts
test-data/     Saved NASCAR feed snapshots for the mock feed and forced views
docs/          Planning docs
.claude/       Shared rules, skills, agents, hooks
```

## Run and test
- Everything runs through Docker Compose: `docker compose up --build` from the repo root.
- Site: https://localhost (self-signed cert). API: https://localhost/api/... (nginx proxies `/api/`).
- Frontend lint: `npm run lint` in `app/frontend`. Backend build: `dotnet build` in `app/backend`.
- Secrets live in `.env` (copy from `.env.example`). Never read, print or edit `.env`.

## Conventions
- Branches: work on your own branch (`matthew`, `soumil`) and merge to `dev` by PR, reviewed by the other person; `dev` goes to `prod` by PR. After a merge into `dev`, each personal branch catches up with `git fetch`, `git merge origin/dev`, `git push`. Never commit to `dev` or `prod`. Don't create other branches unless asked.
- Commits: keep the prefix style (`feat:`, `fix:`, `chore:`, `cleanup:`, `feat!:`) and include the Jira key, e.g. `fix: PAR-10 use flag 5 for checkered`. Put the key in PR titles too.
- Never commit or push unless asked.
- No secrets in the repo, `.mcp.json`, or Terraform. Use environment variables.
- No file over 300 lines. Split into components or services.
- Frontend calls the API with relative paths (`/api/...`).
- No made-up data on any page. Unfinished pages show a clean "coming soon".
- Components work across series (NASCAR now, F1 later) where feasible.
- Agents may write Terraform; only a person runs `terraform apply` or `destroy`.

## Where to look (read when needed)
- `docs/master-plan.md`: phases, status, decisions, open questions
- `docs/backend-spec.md` / `docs/frontend-spec.md`: the work for each side
- `docs/infrastructure-plan.md`: hosting, Terraform, CI/CD, Cloudflare
- `docs/reference.md`: glossary, flag and session tables, ADRs
- `docs/team-onboarding.md`: how we work, tooling
- Jira `PAR` is the source of truth for open work.

## Easy to get wrong
- Flags: 0 none, 1 green, 2 yellow, 3 red, 4 **white**, 5 **checkered**, 6/7 treat as active, 8 hot track, 9 cold track.
- Run types: 1 practice, 2 qualifying, 3 race.
- Series: 1 Cup, 2 O'Reilly Auto Parts (Xfinity through 2025), 3 Craftsman Truck.
- NASCAR JSON is stored as-is; fields are pulled out when read.
- Historical imports are admin-only (`X-Admin-Key`).