# 0004: Decisions from the planning consolidation

**Decided:** 2026-09-23
**Sources:** Master Plan; Infrastructure Plan; Team Onboarding; Frontend Spec; Backend Spec (all dated 2026-09-23)
**Context:** The planning was scattered across 11 files. On this day it was consolidated into six documents, and the decisions below were recorded while doing it.

## 1. DigitalOcean dropped; no early public deploy

**Status:** Accepted

**Decision:** The earlier DigitalOcean deploy is gone. There is no early public deploy. The first public release is the full cloud build (Phase 3).

**Why:** DigitalOcean withdrew its GitHub Student Pack credit on August 1, 2026.

## 2. Deploy to AWS and/or Azure, chosen by cost

**Status:** Accepted, and superseded by 0005, section 2 once that is accepted

**Decision:** The cloud is chosen by cost from AWS, Azure or a mix. This replaced the earlier "AWS over Azure" decision.

## 3. One cloud environment

**Status:** Accepted

**Decision:** There is one cloud environment: production. There are no dev or staging environments in the cloud. `terraform/environments/` has only `prod/`, which leaves room for more later without restructuring.

**Why:** Testing stays local in Docker Compose (section 4), so there's no need for a cloud test environment.

## 4. All testing runs through Docker Compose

**Status:** Accepted

**Decision:** Everything is tested locally in Docker Compose, so the frontend, backend and a sample database run together.

**Why:** The pieces are wired the same way as in production: the browser calls `/api` on the same address, and nginx routes it to the backend.

## 5. Views can be forced two ways for testing, both off in production

**Status:** Accepted

**Decision:**
- **Backend mock feed** (Backend Spec 1.10): replays saved NASCAR feed files from `test-data/nascar/live/` so any session can be forced. Scenarios switch at runtime through admin-only endpoints. The backend refuses to start if the mock is on and the environment is Production.
- **Frontend view override** (Frontend Spec 1.5): `?view=<name>` on the live page loads a saved backend response instead of calling the API. It's only built when `NEXT_PUBLIC_ENABLE_VIEW_OVERRIDE=true`, which only the Compose setup sets, so production builds leave it out entirely. A "TEST VIEW" banner shows whenever it's active.

**Why:** There's no way to test practice, qualifying, red flags or post-race views without waiting for a real session. The mock feed tests the backend's state detection and the frontend together. The override checks the views alone.

## 6. Kubernetes only as a priced option

**Status:** Accepted

**Decision:** Kubernetes is priced as a hosting option but not planned. There's no `k8s/` folder unless a Kubernetes option is chosen.

**Why:** The Kubernetes options are the most expensive in the Infrastructure Plan pricing: about $105 a month on AWS and about $84 on Azure after credits.

## 7. Cloudflare in front of production

**Status:** Accepted (the detailed settings are proposed in section 13)

**Decision:** Production sits behind Cloudflare with the strictest practical security settings, and the origin can't be reached directly.

## 8. Phase 3 requirements

**Status:** Accepted

**Decision:** The first public deploy is done when (Master Plan, Phase 3):
- all infrastructure is defined in Terraform under `terraform/`
- the app is reachable at the production domain through Cloudflare, and the origin can't be reached directly
- GitHub Actions runs CI on every pull request and deploys on merge to `prod` (0007, section 1)
- GitHub logs into the cloud without stored keys (OIDC)
- infrastructure changes need a human approval
- there is one monitoring dashboard and one alert
- the README covers local and cloud deployment

Before that deploy, the backend needs `/health`, the CORS policy removed, production settings, and the mock feed switched off.

## 9. Repo layout

**Status:** Accepted (carried out 2026-09-26; backend folder naming is in 0007)

**Decision:** The repo is reorganized into `app/backend/`, `app/frontend/`, `terraform/`, `scripts/`, `test-data/`, `docs/` and `.claude/`, together with the rename and before Phase 1. The full target layout is in Team Onboarding, section 6.1.
- `.gitignore` stays at the repo root. Each `.dockerignore` sits next to its Dockerfile, because Docker only reads it from the root of each build folder.
- `terraform/bootstrap/` holds the one-time setup of Terraform state storage.

## 10. Where the docs live

**Status:** Accepted

**Decision:** Planning docs live in Google Drive as .docx files, with .md copies in the repo's `docs/` folder so Claude Code can read them. Old documents stay in Drive under Parabolica/Old/ and aren't edited.

## 11. Phases renumbered

**Status:** Accepted

**Decision:**

| Phase | Work |
|---|---|
| 0 | Rename the project and reorganize the repo |
| 1A / 1B | Live audit: backend / frontend, including forced test views |
| 2A / 2B | Historical: backend / frontend |
| 2C | Lap-time charts (renamed race line charts in 0005) |
| 3 | Cloud deployment, the first public release |
| 4A / 4B | F1 historical / F1 live |

Phase 0 comes first. 1A and 1B run in parallel. Phase 3 groundwork (Terraform, CI) doesn't depend on features, so it can start any time.

## 12. Scope and working conventions

**Status:** Accepted (the branch rule is superseded by 0007, section 1)

**Out of scope:**
- user accounts or logins
- ads, paid tiers or any money-making (most free F1 data licenses forbid commercial use)
- a separate mobile design (Tailwind's responsive defaults are the bar for now)
- series beyond NASCAR and F1
- extra cloud environments
- running in several regions, or autoscaling

**Conventions:**
- No file over 300 lines.
- The frontend calls the API with relative paths (`/api/...`), and nginx routes them. No hardcoded API URLs, and no CORS.
- Phase 1 is about structure and correctness, not visual design. When a visual redesign happens isn't decided.
- Commit messages use the prefix style `feat:`, `fix:`, `chore:`, `cleanup:`.
- Never commit secrets. `.env` is gitignored and `.env.example` lists what's needed.
- Tasks are named for the action ("Fix checkered flag check," not "Backend stuff"), and only real, open work is tracked.
- AI agents may write Terraform; only a person runs `terraform apply`.
- Secret values never go in Terraform state: Terraform creates the secret, and its value is set outside Terraform.
- Branches: each developer works on their own branch made from `main` and merges by a pull request the other person reviews. **Superseded by 0007, section 1.**

## 13. Infrastructure Plan recommendations

**Status:** Proposed (recommended in the Infrastructure Plan, not yet agreed)

- **Cloudflare settings:** Full (strict) encryption with a Cloudflare Origin CA certificate, or Cloudflare Tunnel. Never Flexible. The origin accepts traffic only from Cloudflare. Always Use HTTPS, HSTS and a minimum TLS version. WAF Free Managed Ruleset, a custom rule blocking `/api/admin/*` except from our own IPs, a rate limit on `/api/*`, and Bot Fight Mode. Security headers set in nginx or Cloudflare Transform Rules. All managed in Terraform with the Cloudflare provider.
- **Terraform layout:** modules for network, registry, database, app, secrets, cloudflare and monitoring (Infrastructure Plan, section 3).
- **CI/CD:** separate workflow files (`ci.yml`, `cd-backend.yml`, `cd-frontend.yml`, `terraform-plan.yml`, `terraform-apply.yml`) so each part runs only its own pipeline. The approval gate is a GitHub Environment named `prod` with a required reviewer.
- **Secrets:** the cloud's secret store (Azure Key Vault if Azure is final), injected when the container starts. CI stores only non-secret IDs.
- **Monitoring:** OpenTelemetry in ASP.NET Core, sending through a Grafana Alloy collector to Grafana Cloud's free tier, with the custom poll and import metrics and the alert rule in Infrastructure Plan, section 6.
- **Security scanning before the first public deploy:** Dependabot for npm, NuGet, GitHub Actions and Terraform providers; Trivy image scans in CI failing on high or critical issues; CodeQL code scanning.
- **Container registry:** GitHub's registry is free for public repos and saves the cost of the cloud's registry.
