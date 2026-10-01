# 0007: Branch flow, AI tooling rules, and repo conventions

**Decided:** 2026-09-26
**Sources:** decisions made while finishing Phase 0 (reorganizing the repo and setting up Claude Code)

## 1. Branch flow: personal branch, then dev, then prod

**Status:** Accepted (in effect; `main` is retired)

**Decision:** Each developer works on their own branch (`matthew`, `soumil`). Changes go from a personal branch to `dev` by pull request, then from `dev` to `prod` by pull request. The other developer reviews every pull request. After a pull request merges into `dev`, each personal branch is brought up to date with `git fetch`, `git merge origin/dev`, `git push`.

**Rejected:** One short-lived branch per Jira work item. It goes around the personal-branch setup.

**Consequences:**
- Replaces the branch rule in 0004, section 12, and the branch-name convention in 0006, section 2.
- The Jira key still goes in commit messages and pull request titles.
- A merge into `prod` is what deploys (0004, section 8).

## 2. Git is read-only for AI agents

**Status:** Accepted

**Decision:** Claude and any other AI agent can read git (status, diff, log, show, blame, fetch) but never write to it. They never commit, push, pull, merge, rebase, stage files, reset, revert, cherry-pick or tag. They never create or delete branches, and never create, merge or comment on pull requests. This holds even if a plan, skill or plugin says otherwise. Only a human makes commits. When work is ready, the agent stops, says what changed and suggests a commit message.

**Why:** Humans own the history of the repo. Every commit is made by a person who has reviewed the change.

**Enforcement, in the Claude Code setup files:**
- the rule, word for word, near the top of `CLAUDE.md`
- deny rules in `.claude/settings.json` for git and pull request commands that write
- the `validate-bash.sh` PreToolUse hook, which also catches forms like `git -C <path> commit`
- the GitHub MCP server in read-only mode in `.mcp.json`

**Consequences:** Any skill or plugin whose steps commit, branch or open pull requests has to be changed or left out (section 6).

## 3. No version numbers in Markdown

**Status:** Accepted

**Decision:** Markdown files name the technology only, never its version. Versions live in the files that set them: `package.json`, the `.csproj`, the Dockerfiles and `docker-compose.yml`. Instructions that depend on a version tell the reader to check those files.

**Why:** A version written in a doc goes stale. Following an old version without knowing the newest one is the easiest way to stay vulnerable.

**Consequences:** The planning docs copied into `docs/` still contain version tables (Backend Spec 1.11, Frontend Spec 1.1). They need the same cleanup.

## 4. Backend folders are lowercase

**Status:** Accepted

**Decision:** Folders under `app/backend/` are lowercase (`admin`, `data`, `nascar` and their subfolders). `Migrations/` and `Properties/` keep their capital letters. C# namespaces stay capitalized (`Parabolica.Api.Nascar.Services`).

**Why:** Lowercase folders are the preferred style. `Migrations/` and `Properties/` are tied to tooling: EF Core writes new migrations to `Migrations/` by default, and `dotnet run` looks for `Properties/launchSettings.json` with exact capitals on Linux and macOS. Namespaces don't have to match folder names, and keeping them capitalized follows C# convention and avoided editing every file.

## 5. The homelab doesn't host Parabolica

**Status:** Accepted

**Decision:** Parabolica isn't hosted on the homelab. Production goes to the cloud (0005, section 2). The homelab is still for k3s practice and the Prometheus and Grafana project.

## 6. Claude Code setup and AI tooling

**Status:** Accepted for the setup; Proposed for plugins (being researched)

**Decision:**
- Shared Claude Code files are committed: `CLAUDE.md`, `.mcp.json`, `.claude/settings.json`, and `.claude/rules/`, `skills/`, `agents/` and `hooks/`. Personal files (`CLAUDE.local.md`, `.claude/settings.local.json`) are gitignored.
- Shared MCP servers: Context7 (current documentation) and GitHub (read-only). Tokens come from environment variables, never the file.
- The Superpowers and UI/UX Pro Max plugins are on hold until the tooling research is done.
- Anthropic's frontend-design skill is rejected: its output looks generic.

**Replaces:** the AI tooling list in Team Onboarding, section 8, which installed Superpowers and UI/UX Pro Max by default. That section's other rules still stand: both machines run the same tools, data and logic tasks are test-first, and agents may write Terraform but only a person applies it.

## 7. ADRs are grouped by decision date

**Status:** Accepted

**Decision:** Architecture decision records live in `docs/adr/`, one file per day decisions were made, numbered in order. Each decision in a file has its own status: Proposed, Accepted or Superseded. A later file supersedes an earlier decision by naming it. The earlier file is updated to point forward, not deleted.

**Replaces:** the old one-decision-per-file ADRs (old 0001 and 0002) and the decision records section of the Reference doc. Their content is in 0001 here.
